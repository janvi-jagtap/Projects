package p2.wordsuggestor;

import cse332.interfaces.misc.Dictionary;
import cse332.interfaces.worklists.LIFOWorkList;
import cse332.misc.WordReader;
import cse332.types.AlphabeticString;
import cse332.types.NGram;
import datastructures.worklists.ArrayStack;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.function.Supplier;

/**
 * An executable that generates text in the style of the provided input file.
 */
public class WordSuggestor {
    private final int N, K;
    private final NGramToNextChoicesMap ngrams;

    public WordSuggestor(String file, int N, int K,
                         Supplier<Dictionary<NGram, Dictionary<AlphabeticString, Integer>>> newOuter,
                         Supplier<Dictionary<AlphabeticString, Integer>> newInner)
            throws IOException {
        this.N = N;
        this.K = K;
        this.ngrams = new NGramToNextChoicesMap(newOuter, newInner);

        WordReader reader = new WordReader(new FileReader(file));
        int i = 0;
        String[] init = new String[N];

        while (reader.hasNext() && i < N) {
            String value = reader.next();
            init[i] = value;
            i++;
        }

        NGram current = new NGram(init);
        while (reader.hasNext()) {
            String value = reader.next();

            this.ngrams.seenWordAfterNGram(current, value);
            current = current.update(value);
            i++;
        }

        System.out.println("Markov: Created NGrams Table for " + N);

        reader.close();
    }

    /*
     * This method converts a String to an NGram.
     * @param N the length of the NGram to create
     * @param msg the string to convert
     * @return the NGram version of msg
     */
    public static NGram getNGramFromString(int N, String msg) {
        @SuppressWarnings("resource")
        WordReader reader = new WordReader(new StringReader(msg));
        LIFOWorkList<String> allWords = new ArrayStack<String>();
        while (reader.hasNext()) {
            allWords.add(reader.next());
        }

        String[] words = new String[N];
        int i = words.length - 1;
        while (i >= 0 && allWords.hasWork()) {
            words[i] = allWords.next();
            i--;
        }

        for (i = 0; i < words.length; i++) {
            if (words[i] == null) {
                words[i] = "NULL";
            }
        }

        return new NGram(words);
    }

    /**
     * Wrapper that takes in a String and gets the word choices for the
     * corresponding ngram.
     */
    public String[] getSuggestions(String msg) {
        NGram ngram = null;
        if (msg.equals("SOL")) {
            ngram = new NGram(new String[]{"SOL"});
        } else {
            ngram = WordSuggestor.getNGramFromString(this.N, msg);
        }

        return this.ngrams.getWordsAfter(ngram, this.K);
    }

    /**
     * Wrapper that takes in a String and gets the word choices for the
     * corresponding ngram.
     */
    public String[] getAllSuggestions(String msg) {
        return this.ngrams.getWordsAfter(WordSuggestor.getNGramFromString(this.N, msg),
                -1);
    }

    @Override
    public String toString() {
        return this.ngrams.toString();
    }
}
