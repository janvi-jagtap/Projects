package cse332.misc;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * WordReader reads words from a file one-by-one, converting to lower case and
 * eliminating punctuation.
 */
public class WordReader implements Iterator<String>, Closeable {
    private final Reader reader;
    private final StreamTokenizer tok;
    private Integer nextType;
    private String[] nextString;
    private int nextIdx;

    public WordReader(Reader reader) {
        this.reader = reader;
        this.tok = new StreamTokenizer(reader);
        this.tok.eolIsSignificant(true);
        this.tok.lowerCaseMode(true);
        this.tok.wordChars('a', 'z');
        this.tok.wordChars('A', 'Z');
        this.tok.wordChars('\'', '\'');
        String punctuation = "!.;:-[],;!?*+=\\|/(){}\"><";
        for (int i = 0; i < punctuation.length(); i++) {
            this.tok.whitespaceChars(punctuation.charAt(i), punctuation.charAt(i));
        }
    }

    public WordReader(String str) {
        this.reader = new BufferedReader(new StringReader(str));
        this.tok = new StreamTokenizer(this.reader);
        this.tok.eolIsSignificant(false);
        this.tok.lowerCaseMode(true);
        this.tok.wordChars('a', 'z');
        this.tok.wordChars('A', 'Z');
        this.tok.wordChars('\'', '\'');
        String punctuation = "!.;:-[],;!?*+=\\|/(){}\"><";
        for (int i = 0; i < punctuation.length(); i++) {
            this.tok.whitespaceChars(punctuation.charAt(i), punctuation.charAt(i));
        }
    }

    @Override
    public boolean hasNext() {
        if (this.nextType == null) {
            try {
                this.nextType = this.tok.nextToken();
                while (this.nextType != StreamTokenizer.TT_WORD
                        && this.nextType != StreamTokenizer.TT_EOF
                        && this.nextType != StreamTokenizer.TT_EOL) {
                    this.nextType = this.tok.nextToken();
                }
            } catch (IOException e) {
                return hasNext();
            }
        }

        if (this.nextType == StreamTokenizer.TT_EOF) {
            return false;
        }

        if (this.nextString == null) {
            if (this.nextType == StreamTokenizer.TT_EOL) {
                this.nextString = new String[] { "SOL" };
                this.nextIdx = 0;
                return true;
            }

            List<String> strings = new ArrayList<String>();
            StringBuilder s = new StringBuilder();
            StringBuilder quotesBuff = new StringBuilder();

            for (char c : this.tok.sval.toCharArray()) {
                if (('a' <= c && c <= 'z')) {
                    if (quotesBuff.length() > 0) {
                        s.append(quotesBuff);
                    }
                    s.append(c);
                }
                else if (c == '\'') {
                    if (s.length() > 0) {
                        quotesBuff.append(c);
                    }
                }
                else {
                    strings.add(s.toString());
                    quotesBuff = new StringBuilder();
                    s = new StringBuilder();
                }
            }
            if (s.length() > 0) {
                strings.add(s.toString());
            }
            this.nextString = strings.toArray(new String[strings.size()]);// tok.sval.replaceAll("[^a-z']",
                                                                          // "
                                                                          // ").split("
                                                                          // ");
            this.nextIdx = 0;
        }
        if (this.nextIdx >= this.nextString.length
                || (this.nextString[this.nextIdx].length() == 1
                        && !(this.nextString[this.nextIdx].charAt(0) == 'a'
                                || this.nextString[this.nextIdx].charAt(0) == 'i'))
                || this.nextString[this.nextIdx].length() == 0) {
            this.nextType = null;
            this.nextString = null;
            return hasNext();
        }
        return true;
    }

    @Override
    public String next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        return this.nextString[this.nextIdx++];
    }

    @Override
    public void remove() {
        throw new UnsupportedOperationException();
    }

    @Override
    public void close() throws IOException {
        this.reader.close();
    }
}
