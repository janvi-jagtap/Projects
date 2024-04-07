package chat;

import javax.swing.*;
import java.io.*;
import java.net.Socket;
import java.net.UnknownHostException;

public class UMessageServerConnection extends Thread {
    private final static String SERVER = "umessage.cse332.snackoverflow.top";
    private final static int SERVER_PORT = 9001;
    private final static String SERVER_PASSWORD = "WA-520_Evergreen-Point-Floating-Bridge";
    public final static String CHAT_CHANNEL = "#cse332";

    private final String username;

    private final BufferedWriter out;
    private final BufferedReader in;

    private final uMessage main;
    private final Socket socket;

    public UMessageServerConnection(uMessage main, String username)
            throws IOException {
        this.username = username.toLowerCase();
        this.main = main;

        // Connect directly to the IRC server.
        this.socket = new Socket(UMessageServerConnection.SERVER, SERVER_PORT);
        this.out = new BufferedWriter(
                new OutputStreamWriter(this.socket.getOutputStream()));
        this.in = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
    }

    public void go() throws IOException {
        // Log on to the server.
        write("PASS", UMessageServerConnection.SERVER_PASSWORD);
        write("NICK", this.username);
        write("USER", this.username, "-", "-", "-");

        // Read lines from the server until it tells us we have connected.
        String line = null;

        while ((line = this.in.readLine()) != null) {
            try {
                if (line.startsWith("PING")) {
                    write("PONG", line.substring(5));
                    continue;
                }
                int code = Integer.parseInt(line.split(" ")[1]);
                switch (code) {
                    case IRCCodes.RplMyInfo:
                        this.main.loggedIn(this.username);

                        write("JOIN", UMessageServerConnection.CHAT_CHANNEL);
                        start();
                        return;
                    case IRCCodes.ErrNickNameInUse:
                        this.main.badNick();
                        this.socket.close();
                        return;
                }
            } catch (NumberFormatException e) {
                System.out.println("[Message from Server] " + line);
            }
        }
    }

    public String getAccountName() {
        return this.username;
    }

    public void send(String cmd, String text) {
        try {
            cmd = cmd.trim();
            switch (cmd) {
                case "MAIN":
                    m_channel(UMessageServerConnection.CHAT_CHANNEL, text);
                    break;
                default:
                    String[] parts = text.split(" ", 2);
                    cmd = parts[0].trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void write(String... args) throws IOException {
        StringBuilder str = new StringBuilder();

        int i = 0;
        while (i < args.length - 1) {
            str.append(args[i] + " ");
            i++;
        }
        if (args.length > 0) {
            str.append(args[i]);
        }
        this.out.write(str.toString());
        this.out.write("\r\n");
        this.out.flush();
    }

    public void m_channel(String channel, String msg) throws IOException {
        write("PRIVMSG", channel, ":" + msg);
    }

    @Override
    public void run() {
        try {
            String line = null;
            // Keep reading lines from the server.
            while ((line = this.in.readLine()) != null) {
                if (line.startsWith("PING")) {
                    write("PONG", line.substring(5));
                } else if (line.split(" ")[1].trim().equals("353")) {
                    int code = Integer.parseInt(line.split(" ")[1]);
                    switch (code) {
                        // List of users...
                        case IRCCodes.RplNamReply:
                            String[] names = line.split(":")[2].split(" ");
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    main.window.addUsers(names);
                                }
                            });
                            break;
                    }
                } else {
                    String cmd = line.split(" ")[1];
                    final String[] lineParts = line.split(":");
                    switch (cmd) {
                        case "QUIT":
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    main.window.removeUser(lineParts[1].split("!")[0]);
                                }
                            });
                            break;
                        case "JOIN":
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    main.window.addUser(lineParts[1].split("!")[0]);
                                }
                            });
                            break;
                        case "PRIVMSG":
                            if (!line.split(" ")[2].equals(this.username)) {
                                return;
                            }
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    main.window.gotMessage(lineParts[1].split("!")[0],
                                            lineParts[2]);
                                }
                            });
                            break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
