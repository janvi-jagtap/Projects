package p2.wordsuggestor;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Stack;

public final class ParseFBMessages {
    private ParseFBMessages() {
        /* should not be instantiated */
    }

    // INSTRUCTIONS:
    //
    // <Your FB Name> may be either:
    //  1) Your name on Messenger (e.g. "Danny Allen")
    //  2) Your username on facebook, which can be found by looking at the URL on your profile
    // It's typically 1), but for whatever reason Facebook sometimes labels them
    // with 2) (sorry!). You can check which one your messages are labeled with by
    // opening up one of the message files and taking a look.
    //
    // <Your FB Archive> is the directory on your computer where the archive is stored.
    // (e.g. "/Users/Me/Downloads/MyArchiveName" or "C:\Users\Me\Downloads\MyArchiveName")
    // You may be able to use a relative path like "./MyArchiveName", but results can
    // vary from machine to machine.
    //
    // DO NOT PUSH YOUR ME.TXT FILE TO GITLAB. WE DO NOT WANT YOUR PRIVATE CONVERSATIONS!!!!
    public static void main(String[] args) throws IOException {
        String name = "<Your FB Name>"; // e.g. "Ruth Anderson"
        String archive = "<Your FB Archive>"; // e.g. "/Users/rea/workspace/332/facebook-rea/messages"

        Stack<String> corpus = new Stack<>();
        File[] listOfFiles = (new File(archive + File.separator + "inbox")).listFiles();

        for (int i = 0; i < listOfFiles.length; i++) {
            File conversation = new File(listOfFiles[i], "message_1.json");
            if (conversation.isFile()) {
                try {
                    JSONObject obj = (JSONObject) new JSONParser().parse(new FileReader(conversation));
                    JSONArray messages = (JSONArray) obj.get("messages");
                    for (Object m : messages) {
                        JSONObject msg = (JSONObject) m;
                        String sender = (String) msg.get("sender_name");
                        String type = (String) msg.get("type");
                        if (sender != null && sender.equals(name) && (type == null || type.equals("Generic"))) {
                            corpus.push((String) msg.get("content"));
                        }
                    }
                } catch (ParseException e) {
                    System.err.println("Could not parse: " + conversation.toString());
                }
            }
        }

        PrintWriter out = new PrintWriter("me.txt", StandardCharsets.UTF_8);

        while (!corpus.isEmpty()) {
            out.println(corpus.pop());
        }

        out.close();
    }
}
