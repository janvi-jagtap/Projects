package chat;

import cse332.interfaces.misc.Dictionary;
import cse332.types.AlphabeticString;
import cse332.types.NGram;
import javafx.embed.swing.JFXPanel;
import p2.clients.NGramTester;
import p2.wordsuggestor.WordSuggestor;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;
import java.util.function.Supplier;

public class uMessage {
    private static final int N = 3;
    private static final String CORPUS = "corpus/eggs.txt";
    // Use .binarySearchTreeConstructor(); if you want to test things since it is an implementation we provide and is guaranteed to work
    // Other examples:
    // .trieConstructor(NGram.class);
    // .trieConstructor(AlphabeticString.class);
    // .hashtableConstructor(NGramTester.avlTreeConstructor());
    // .hashtableConstructor(NGramTester.binarySearchTreeConstructor());
    private static final Supplier<Dictionary<NGram, Dictionary<AlphabeticString, Integer>>> NEW_OUTER = NGramTester
            .binarySearchTreeConstructor();
    private static final Supplier<Dictionary<AlphabeticString, Integer>> NEW_INNER = NGramTester
            .binarySearchTreeConstructor();

    /*
     *
     *
     *
     *
     *
     */
    private JFrame frmUmessageLogin;
    private JTextField username;
    private JButton login;
    private Component horizontalStrut;
    private Component horizontalStrut_2;
    private Component verticalStrut;
    private JLabel errors;
    private boolean loggingIn;
    private static boolean[] loading;
    private static WordSuggestor[] markov;
    public MainWindow window;
    public UMessageServerConnection connection;

    static class MarkovLoader implements Runnable {
        private final uMessage window;
        private final int i;

        public MarkovLoader(uMessage window, int i) {
            super();
            this.window = window;
            this.i = i;
        }

        @Override
            public void run() {
                int N = uMessage.N;
                try {
                    uMessage.markov[this.i] = new WordSuggestor(uMessage.CORPUS, N - this.i,
                            4, uMessage.NEW_OUTER, uMessage.NEW_INNER);
                    this.window.update();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
    }

    /**
     * Launch the application.
     */
    public static void main(String[] args) {
        (new Thread() {
            public void run() {
                new JFXPanel();
            }
        }).start();

        final uMessage window = new uMessage();
        markov = new WordSuggestor[uMessage.N];

        JDialog dialog = new JDialog((JFrame)null, "Please wait...", true);//true means that the dialog created is modal
        JLabel lblStatus = new JLabel("<html><b>Loading Markov Data (n = " + uMessage.N + ")...</b><br>Depending on the data structures you're using<br>" + 
            "and your computer, this might take a bit.</html>"); 

        JProgressBar pbProgress = new JProgressBar(0, 100);
        pbProgress.setIndeterminate(true); //we'll use an indeterminate progress bar

        dialog.add(BorderLayout.NORTH, lblStatus);
        dialog.add(BorderLayout.CENTER, pbProgress);
        dialog.addWindowListener(new WindowAdapter() { 
            @Override public void windowClosing(WindowEvent e) { 
              System.exit(0);
            }
        });
        dialog.setSize(300, 90);

        SwingWorker<Void, Void> sw = new SwingWorker<Void, Void>() {
            @Override
            protected Void doInBackground() throws Exception {
                for (int i2 = 1; i2 < uMessage.N; i2++) {
                    new Thread(new MarkovLoader(window, i2)).start();
                }
                new MarkovLoader(window, 0).run();
                return null;
            }

            @Override
            protected void done() {
                dialog.dispose();//close the modal dialog
                window.frmUmessageLogin.setVisible(true);
            }
        };

        sw.execute(); // this will start the processing on a separate thread
        dialog.setVisible(true); //this will block user input as long as the processing task is working
    }

    /**
     * Create the application.
     */
    public uMessage() {
        initialize();
    }

    /**
     * Initialize the contents of the frame.
     */
    private void initialize() {
        this.frmUmessageLogin = new JFrame();
        this.frmUmessageLogin.setTitle("uMessage: Login");
        this.frmUmessageLogin.setBounds(100, 100, 450, 148);
        this.frmUmessageLogin.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        GridBagLayout gridBagLayout = new GridBagLayout();
        gridBagLayout.columnWidths = new int[] { 0, 90, 90, 90, 0, 0 };
        gridBagLayout.rowHeights = new int[] { 0, 9, 0, 0 };
        gridBagLayout.columnWeights = new double[] { 0.0, 0.0, 1.0, 0.0, 0.0,
            Double.MIN_VALUE };
        gridBagLayout.rowWeights = new double[] { 0.0, 0.0, 0.0, Double.MIN_VALUE };
        this.frmUmessageLogin.getContentPane().setLayout(gridBagLayout);

        this.verticalStrut = Box.createVerticalStrut(20);
        GridBagConstraints gbc_verticalStrut = new GridBagConstraints();
        gbc_verticalStrut.insets = new Insets(0, 0, 5, 5);
        gbc_verticalStrut.gridx = 2;
        gbc_verticalStrut.gridy = 0;
        this.frmUmessageLogin.getContentPane().add(this.verticalStrut, gbc_verticalStrut);

        this.horizontalStrut = Box.createHorizontalStrut(20);
        GridBagConstraints gbc_horizontalStrut = new GridBagConstraints();
        gbc_horizontalStrut.insets = new Insets(0, 0, 5, 5);
        gbc_horizontalStrut.gridx = 0;
        gbc_horizontalStrut.gridy = 1;
        this.frmUmessageLogin.getContentPane().add(this.horizontalStrut,
                gbc_horizontalStrut);

        JLabel usernameLabel = new JLabel("UWnetID:");
        GridBagConstraints gbc_usernameLabel = new GridBagConstraints();
        gbc_usernameLabel.fill = GridBagConstraints.BOTH;
        gbc_usernameLabel.insets = new Insets(0, 0, 5, 5);
        gbc_usernameLabel.gridx = 1;
        gbc_usernameLabel.gridy = 1;
        this.frmUmessageLogin.getContentPane().add(usernameLabel, gbc_usernameLabel);

        this.username = new JTextField();
        this.username.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                (new Thread() {
                    public void run() {
                        if (update() && e.getKeyCode() == KeyEvent.VK_ENTER) {
                            uMessage.this.login.setEnabled(false);
                            login();
                        }
                    }
                }).start();
            }
        });

        GridBagConstraints gbc_username = new GridBagConstraints();
        gbc_username.gridwidth = 2;
        gbc_username.fill = GridBagConstraints.BOTH;
        gbc_username.insets = new Insets(0, 0, 5, 5);
        gbc_username.gridx = 2;
        gbc_username.gridy = 1;
        this.frmUmessageLogin.getContentPane().add(this.username, gbc_username);
        this.username.setColumns(10);

        this.horizontalStrut_2 = Box.createHorizontalStrut(20);
        GridBagConstraints gbc_horizontalStrut_2 = new GridBagConstraints();
        gbc_horizontalStrut_2.insets = new Insets(0, 0, 5, 0);
        gbc_horizontalStrut_2.gridx = 4;
        gbc_horizontalStrut_2.gridy = 1;
        this.frmUmessageLogin.getContentPane().add(this.horizontalStrut_2,
                gbc_horizontalStrut_2);

        this.login = new JButton("Login");
        this.login.setEnabled(false);
        this.login.addActionListener(e -> login());

        this.errors = new JLabel("");
        GridBagConstraints gbc_errors = new GridBagConstraints();
        gbc_errors.gridwidth = 2;
        gbc_errors.insets = new Insets(0, 0, 0, 5);
        gbc_errors.gridx = 1;
        gbc_errors.gridy = 2;
        this.frmUmessageLogin.getContentPane().add(this.errors, gbc_errors);
        GridBagConstraints gbc_login = new GridBagConstraints();
        gbc_login.insets = new Insets(0, 0, 0, 5);
        gbc_login.fill = GridBagConstraints.BOTH;
        gbc_login.gridx = 3;
        gbc_login.gridy = 2;
        this.frmUmessageLogin.getContentPane().add(this.login, gbc_login);
    }

    public boolean update() {
        if (!this.loggingIn && this.username.getText().length() > 0) {
            this.login.setEnabled(true);
            this.errors.setForeground(Color.BLACK);
            return true;
        }
        else {
            this.login.setEnabled(false);
            return false;
        }
    }

    public void login() {
        this.loggingIn = true;
        update();
        try {
            connection = new UMessageServerConnection(uMessage.this,
                    username.getText().replaceAll(" ", ""));
            connection.go();
        } catch (IOException e1) {}
    }

    public void badNick() {
        this.loggingIn = false;
        update();
        this.errors.setText("That username is already in use! Try another one.");
        this.errors.setForeground(Color.RED);
    }

    public void loggedIn(String username) {
        this.frmUmessageLogin.dispose();
        this.window = new MainWindow(username, uMessage.markov, this.connection);
        this.loggingIn = false;
        update();
    }
}
