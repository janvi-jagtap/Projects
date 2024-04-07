package chat;

import p2.wordsuggestor.WordSuggestor;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

public class MainWindow {
    private JFrame frame;
    private List<String> usernames;
    private final List<ChatWindow> chats;
    private final WordSuggestor[] markov;
    private UsersModel model;
    private final String username;
    private final UMessageServerConnection connection;

    /**
     * Create the application.
     */
    public MainWindow(String username, WordSuggestor[] markov,
            UMessageServerConnection connection) {
        this.connection = connection;
        this.markov = markov;
        this.username = username;
        this.chats = new ArrayList<ChatWindow>();
        initialize();
        this.frame.setVisible(true);
    }

    /**
     * Initialize the contents of the frame.
     */
    private void initialize() {
        this.frame = new JFrame();
        this.frame.setTitle("uMessage: Chat Users Online");
        this.frame.setBounds(100, 100, 283, 300);
        this.frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.frame.getContentPane().setLayout(new BorderLayout(0, 0));

        JList<String> list = new JList<String>();
        list.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                (new Thread() {
                    public void run() {
                        @SuppressWarnings("unchecked")
                        JList<String> list = (JList<String>) e.getSource();
                        if (e.getClickCount() == 2) {
                            int index = list.locationToIndex(e.getPoint());
                            for (ChatWindow client : MainWindow.this.chats) {
                                if (client.theirUsername
                                        .equals(MainWindow.this.usernames.get(index))) {
                                    client.show();
                                    return;
                                }
                            }

                            MainWindow.this.chats
                                    .add(new ChatWindow(MainWindow.this.usernames.get(index),
                                            MainWindow.this.markov, MainWindow.this.connection));
                        }
                    }
                }).start();
            }
        });

        this.usernames = new ArrayList<String>();
        this.usernames.add("eliza");
        this.model = new UsersModel(this.usernames);
        list.setModel(this.model);
        list.setFont(new Font("Lucida Grande", Font.PLAIN, 22));
        this.frame.getContentPane().add(list, BorderLayout.CENTER);
    }

    public void addUsers(String[] users) {
        SortedSet<String> usersSet = new TreeSet<String>(this.usernames);
        for (String user : users) {
            usersSet.add(user);
        }
        usersSet.remove(this.username);
        this.usernames = new ArrayList<String>(usersSet);
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {}
        this.model.update(this.usernames);
    }

    public void removeUser(String user) {
        this.model.remove(user);
    }

    public void addUser(String user) {
        this.model.add(user);
    }

    public void gotMessage(String from, String msg) {
        for (ChatWindow chat : this.chats) {
            if (chat.theirUsername.equals(from)) {
                chat.receiveMessage(msg);
                chat.show();
                return;
            }
        }

        // We need to make a new window...
        ChatWindow next = new ChatWindow(from, this.markov, this.connection);
        this.chats.add(next);
        next.receiveMessage(msg);
    }

}
