package chat;

import cse332.misc.WordReader;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.scene.web.WebView;
import org.alicebot.ab.*;
import p2.wordcorrector.SpellingCorrector;
import p2.wordsuggestor.WordSuggestor;

import javax.swing.*;
import java.awt.*;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ChatWindow {
    private JFrame frame;
    private JTextField myMessage;
    private WebView chatMessages;
    private JFXPanel chatMessagesPanel;
    private JButton[] suggestions;
    private final StringBuilder content;
    public String theirUsername;
    public Chat esession;
    private final WordSuggestor[] markov;
    private final UMessageServerConnection connection;
    private final SpellingCorrector checker;
    public String undo;

    /**
     * Create the application.
     */
    public ChatWindow(String username, WordSuggestor[] markov,
            UMessageServerConnection connection) {
        this.theirUsername = username;
        this.markov = markov;
        this.connection = connection;

        this.checker = new SpellingCorrector();

        this.content = new StringBuilder();
        initialize();
        refreshSuggestions();
        this.frame.setTitle("Chat: " + username);
        this.frame.setVisible(true);

        if (this.theirUsername.equals("eliza")) {
            MagicStrings.setRootPath();
            AIMLProcessor.extension = new PCAIMLProcessorExtension();
            MagicBooleans.jp_tokenize = false;
            MagicBooleans.trace_mode = false;
            Graphmaster.enableShortCuts = true;
            Bot bot = new Bot("alice2", MagicStrings.root_path, "chat"); //

            this.esession = new Chat(bot);
        }
    }

    /**
     * Initialize the contents of the frame.
     */
    private void initialize() { 
        this.frame = new JFrame();
        this.frame.setBounds(100, 100, 290, 390);
        this.frame.setDefaultCloseOperation(WindowConstants.HIDE_ON_CLOSE);
        GridBagLayout gridBagLayout = new GridBagLayout();
        gridBagLayout.columnWidths = new int[] { 446, 0 };
        gridBagLayout.rowHeights = new int[] { 200, 20, 0, 20, 0, 0 };
        gridBagLayout.columnWeights = new double[] { 1.0, Double.MIN_VALUE };
        gridBagLayout.rowWeights = new double[] { 1.0, 0.0, 0.0, 0.0, 0.0,
                Double.MIN_VALUE };
        this.frame.getContentPane().setLayout(gridBagLayout);

        GridBagConstraints gbc_msgScrollPane = new GridBagConstraints();
        gbc_msgScrollPane.weighty = 5.0;
        gbc_msgScrollPane.weightx = 5.0;
        gbc_msgScrollPane.fill = GridBagConstraints.BOTH;
        gbc_msgScrollPane.insets = new Insets(0, 0, 5, 0);
        gbc_msgScrollPane.gridx = 0;
        gbc_msgScrollPane.gridy = 0;

        show();

        (new Thread() {
            public void run() {
                try {
                    String path = new java.io.File(".").getCanonicalPath();
                    content.append("<link rel='stylesheet' type='text/css' href='file:///"
                            + path + "/chat.css'>");
                    content.append("<head>");
                    content.append(
                            "   <script language=\"javascript\" type=\"text/javascript\">");
                    content.append("       function toBottom(){");
                    content
                            .append("           window.scrollTo(0, document.body.scrollHeight);");
                    content.append("       }");
                    content.append("   </script>");
                    content.append("</head>");
                    content.append("<body onload='toBottom()'>");
                } catch (IOException e1) {
                }
            }
        }).start();

        JPanel suggestionsPanel = new JPanel();
        GridBagConstraints gbc_suggestionsPanel = new GridBagConstraints();
        gbc_suggestionsPanel.insets = new Insets(0, 0, 5, 0);
        gbc_suggestionsPanel.fill = GridBagConstraints.BOTH;
        gbc_suggestionsPanel.gridx = 0;
        gbc_suggestionsPanel.gridy = 1;
        this.frame.getContentPane().add(suggestionsPanel, gbc_suggestionsPanel);
        FlowLayout fl_suggestionsPanel = new FlowLayout(FlowLayout.CENTER, 5, 0);
        suggestionsPanel.setLayout(fl_suggestionsPanel);

        JPanel myMessagePanel = new JPanel();
        GridBagConstraints gbc_myMessagePanel = new GridBagConstraints();
        gbc_myMessagePanel.insets = new Insets(0, 0, 5, 0);
        gbc_myMessagePanel.fill = GridBagConstraints.BOTH;
        gbc_myMessagePanel.gridx = 0;
        gbc_myMessagePanel.gridy = 3;
        this.frame.getContentPane().add(myMessagePanel, gbc_myMessagePanel);
        myMessagePanel.setLayout(new BoxLayout(myMessagePanel, BoxLayout.X_AXIS));

        Component leftSpacer = Box.createHorizontalStrut(5);
        myMessagePanel.add(leftSpacer);

        this.myMessage = new HintTextField("Send a message");
        this.myMessage.addActionListener(e -> {
            String msg = ChatWindow.this.myMessage.getText();
            if (msg.isEmpty()) {
                return;
            }
            ChatWindow.this.myMessage.setText("");
            updateChat(msg, true);
            sendMessage(msg);
        });

        this.myMessage.addKeyListener(new KeyListener() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_SPACE) {
                    ChatWindow.this.undo = null;
                    autocorrect();
                    refreshSuggestions();
                }
                else if (((e.getKeyCode() == KeyEvent.VK_BACK_SPACE)
                        || (e.getKeyCode() == KeyEvent.VK_DELETE))
                        && ChatWindow.this.undo != null) {
                    ChatWindow.this.myMessage.setText(ChatWindow.this.undo);
                    ChatWindow.this.undo = null;
                }
                else if (e.getKeyCode() >= KeyEvent.VK_A
                        && e.getKeyCode() <= KeyEvent.VK_Z) {
                    if (!autocomplete()) {
                        ChatWindow.this.undo = null;
                    }
                }
                else {
                    ChatWindow.this.undo = null;
                }
            }

            @Override
            public void keyPressed(KeyEvent e) {
            }

            @Override
            public void keyTyped(KeyEvent e) {
            }
        });

        this.myMessage.setAlignmentX(Component.RIGHT_ALIGNMENT);
        this.myMessage.setColumns(1);
        this.myMessage.setBorder(new RoundedCornerBorder());
        myMessagePanel.add(this.myMessage);

        Component rightSpacer = Box.createHorizontalStrut(5);
        myMessagePanel.add(rightSpacer);

        this.suggestions = new JButton[4];
        for (int i = 0; i < this.suggestions.length; i++) {
            this.suggestions[i] = new JButton("SUG " + i);
            suggestionsPanel.add(this.suggestions[i]);
            this.suggestions[i].addActionListener(e -> {
                JButton suggestion = (JButton) e.getSource();
                String text = (ChatWindow.this.myMessage.getText().trim() + " "
                        + suggestion.getText()).trim() + " ";
                ChatWindow.this.myMessage.setText(text);
                refreshSuggestions();
                ChatWindow.this.myMessage.grabFocus();
            });
            this.myMessage.addFocusListener(new FocusListener() {
                @Override
                public void focusGained(FocusEvent fe) {
                    ChatWindow.this.myMessage.setCaretPosition(
                            ChatWindow.this.myMessage.getDocument().getLength());
                }

                @Override
                public void focusLost(FocusEvent fe) {
                }
            });
        }

        KeyListener giveFocus = new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
                ChatWindow.this.myMessage.dispatchEvent(e);
            }

            @Override
            public void keyPressed(KeyEvent e) {
                if (!e.isControlDown() && !e.isMetaDown()) {
                    ChatWindow.this.myMessage.grabFocus();
                    ChatWindow.this.myMessage.dispatchEvent(e);
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                ChatWindow.this.myMessage.dispatchEvent(e);
            }
        };
        this.frame.addKeyListener(giveFocus);
        suggestionsPanel.addKeyListener(giveFocus);
        myMessagePanel.addKeyListener(giveFocus);

        (new Thread() {
            public void run() {
                chatMessagesPanel = new JFXPanel();
                chatMessagesPanel.addKeyListener(giveFocus);
                frame.getContentPane().add(chatMessagesPanel, gbc_msgScrollPane);
                Platform.runLater(() -> {
                    ChatWindow.this.chatMessages = new WebView();

                    BorderPane borderPane = new BorderPane();
                    borderPane.setCenter(ChatWindow.this.chatMessages);
                    Scene scene = new Scene(borderPane, 450, 450);
                    ChatWindow.this.chatMessagesPanel.setScene(scene);
                });

            }
        }).start();


        this.frame.pack();
        show();
        this.myMessage.requestFocusInWindow();
    }

    public void show() {
        this.frame.setVisible(true);
    }

    public void refreshSuggestions() {
        List<String> suggs = new ArrayList<String>();

        String text = ("SOL " + this.myMessage.getText()).trim();

        for (int markovIdx = 0; markovIdx < this.markov.length; markovIdx++) {
            String[] newSuggestions = this.markov[markovIdx].getSuggestions(text);
            System.out.println("Trying: " + Arrays.toString(newSuggestions));
        }

        for (int markovIdx = text.equals("SOL") ? this.markov.length - 1
                : 0; markovIdx < this.markov.length; markovIdx++) {
            String[] newSuggestions = this.markov[markovIdx].getSuggestions(text);

            for (String sugg : newSuggestions) {
                if (suggs.size() < this.suggestions.length && sugg != null
                        && !sugg.equals("SOL") && !suggs.contains(sugg)) {
                    suggs.add(sugg);
                }
            }
        }

        for (int i = 0; i < suggs.size(); i++) {
            this.suggestions[i].setVisible(true);
            this.suggestions[i].setText(suggs.get(i));
        }

        for (int i = suggs.size(); i < this.suggestions.length; i++) {
            this.suggestions[i].setVisible(false);
        }

    }

    public boolean autocomplete() {
        String[] words = this.myMessage.getText().split(" ");
        String result = this.checker.getSingleOption(words[words.length - 1]);

        if (result != null) {
            String text = ("SOL " + this.myMessage.getText()).trim();
            int lastSpace = text.lastIndexOf(' ');
            String allButLast = lastSpace > -1 ? text.substring(0, lastSpace) : null;
            if (allButLast != null) {
                this.undo = this.myMessage.getText();
                String newText = (allButLast.replaceAll("SOL", "") + " " + result).trim();
                if (this.myMessage.getText().startsWith(newText)) {
                    return false;
                }
                this.myMessage.setText(newText);
                return true;
            }
        }
        return false;
    }

    public boolean autocorrect() {
        List<String> words = new ArrayList<String>();
        @SuppressWarnings("resource")
        WordReader reader = new WordReader(this.myMessage.getText());
        words.add("SOL");
        while (reader.hasNext()) {
            words.add(reader.next());
        }

        if (words.isEmpty()) {
            return false;
        }

        String last = words.get(words.size() - 1);

        if (this.checker.check(last)) {
            return false;
        }

        String text = ("SOL " + this.myMessage.getText()).trim();
        int lastSpace = text.lastIndexOf(' ');
        String allButLast = lastSpace > -1 ? text.substring(0, lastSpace) : null;

        String best = this.checker.getMostLikely(this.markov, allButLast, last);

        if (best == null || best.equals("SOL")) {
            return false;
        }
        else {
            this.undo = this.myMessage.getText().trim();
            this.myMessage.setText(
                    (allButLast.replaceAll("SOL", "") + " " + best).trim() + " ");
            return true;
        }
    }

    public void sendMessage(String msg) {
        if (this.theirUsername.equals("eliza")) {
            receiveMessage(this.esession.multisentenceRespond(msg));
            return;
        }
        else {
            try {
                this.connection.m_channel(this.theirUsername, msg);
            } catch (IOException e) {
            }
        }
    }

    public void receiveMessage(String msg) {
        updateChat(msg, false);
    }

    public void updateChat(String msg, boolean me) {
        String meStr = me ? "me" : "them";
        String newCol = "<td><div class=\"from-" + meStr + "\">" + msg + "</div></td>";
        if (!me) {
            newCol = newCol + "<td></td>";
        }
        else {
            newCol = "<td></td>" + newCol;
        }

        this.content.append(
                "<table width=\"100%\">" + "<tr>" + newCol + "</tr>" + "</table>");
        Platform.runLater(() -> ChatWindow.this.chatMessages.getEngine()
                .loadContent(ChatWindow.this.content.toString()));
    }
}
