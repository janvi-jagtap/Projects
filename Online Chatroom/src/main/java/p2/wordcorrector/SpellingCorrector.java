package p2.wordcorrector;

import cse332.interfaces.worklists.FIFOWorkList;
import cse332.types.AlphabeticString;
import datastructures.worklists.ListFIFOQueue;
import p2.sorts.QuickSort;
import p2.wordsuggestor.WordSuggestor;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class SpellingCorrector {
    private final AutocompleteTrie dictionary;

    public SpellingCorrector() {
        this.dictionary = new AutocompleteTrie();
        Scanner dict;
        try {
            dict = new Scanner(new File("./corpus/dictionary2.txt"));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(
                    "Couldn't read dictionary file for spelling correction and autocompletion.");
        }
        int i = 0;
        while (dict.hasNext()) {
            AlphabeticString temp = new AlphabeticString(
                    dict.next().toLowerCase().replaceAll("[^a-z]", ""));
            this.dictionary.insert(temp, i);
            i++;
        }
        dict.close();
    }

    public boolean check(String word) {
        return this.dictionary.find(new AlphabeticString(word)) != null;
    }

    public String getSingleOption(String word) {
        return this.dictionary.autocomplete(word);
    }

    private class CorrectionChoice implements Comparable<CorrectionChoice> {
        public String word;
        public int editDistance;
        public int dictionaryPosition;

        public CorrectionChoice(String word, int editDistance, int dictionaryPosition) {
            this.word = word;
            this.editDistance = editDistance;
            this.dictionaryPosition = dictionaryPosition;
        }

        @Override
        public String toString() {
            return this.word + ":" + this.editDistance + ":" + this.dictionaryPosition;
        }

        @Override
        public int compareTo(CorrectionChoice other) {
            int result = this.editDistance - other.editDistance;
            if (result != 0) {
                return result;
            }
            return this.dictionaryPosition - other.dictionaryPosition;
        }
    }

    public static final int MAX_EDITS = 2;

    public void editDistance(FIFOWorkList<CorrectionChoice> results, String processed,
                             String remaining, int numEdits) {
        if (!this.dictionary.findPrefix(new AlphabeticString(processed))) {
            return;
        }

        if (numEdits > SpellingCorrector.MAX_EDITS) {
            return;
        }

        if (remaining.isEmpty()) {
            Integer dictionaryPosition = this.dictionary
                    .find(new AlphabeticString(processed));
            if (dictionaryPosition != null) {
                results.add(
                        new CorrectionChoice(processed, numEdits, dictionaryPosition));
            }
            return;
        }

        // Use
        editDistance(results, processed + remaining.charAt(0), remaining.substring(1),
                numEdits);

        // Delete
        editDistance(results, processed, remaining.substring(1), numEdits + 2);

        for (char c : "abcdefghijklmnopqrstuvwxyz".toCharArray()) {
            // Replace
            editDistance(results, processed + c, remaining.substring(1), numEdits + 1);

            // Insert
            editDistance(results, processed + c, remaining, numEdits + 1);
        }

        // Swap
        if (processed.length() > 0) {
            int len = processed.length();
            editDistance(results,
                    processed.substring(0, len - 1) + remaining.charAt(0)
                            + processed.charAt(len - 1),
                    remaining.substring(1), numEdits + 1);
        }
    }

    public String getMostLikely(WordSuggestor[] markovs, String text, String word) {
        if (text == null) {
            return null;
        }

        if (this.dictionary.find(new AlphabeticString(text)) != null) {
            return text;
        }

        // Find all the words within edit distance two of the misspelled word.
        FIFOWorkList<CorrectionChoice> fifo = new ListFIFOQueue<>();
        editDistance(fifo, "", word, 0);

        CorrectionChoice[] choices = new CorrectionChoice[fifo.size()];
        for (int i = 0; i < choices.length; i++) {
            choices[i] = fifo.next();
        }

        QuickSort.sort(choices);

        if (choices.length > 0 && choices[0].editDistance <= 1
                && choices[1].dictionaryPosition <= 200) {
            return choices[0].word;
        }

        // Generate choices based on filling the next expected word (using
        // WordSuggestor)
        for (int m = 0; m < markovs.length; m++) {
            String[] fromMarkov = null;
            fromMarkov = markovs[m].getAllSuggestions(text);
            if (fromMarkov != null) {
                for (int i = 0; i < choices.length; i++) {
                    for (String x : fromMarkov) {
                        // If WordSuggestor sees the word as likely and it has
                        // low edit distance,
                        // we found a GOOD match!
                        // N.B. "SOL" means "Start of Line"; we want to avoid
                        // actually choosing a
                        // "start of line character".
                        if (choices[i].word.equals(x)) {
                            return x;
                        }
                    }
                }
            }
        }

        return null;
    }
}
