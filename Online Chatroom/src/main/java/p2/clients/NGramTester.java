package p2.clients;

import cse332.datastructures.trees.BinarySearchTree;
import cse332.interfaces.misc.Dictionary;
import cse332.types.AlphabeticString;
import cse332.types.BString;
import cse332.types.NGram;
import datastructures.dictionaries.AVLTree;
import datastructures.dictionaries.ChainingHashTable;
import datastructures.dictionaries.HashTrieMap;
import p2.wordsuggestor.WordSuggestor;

import java.io.IOException;
import java.util.function.Supplier;

public class NGramTester {
    public static <A extends Comparable<A>, K extends BString<A>, V> Supplier<Dictionary<K, V>> trieConstructor(Class<K> clz) {
        return () -> new HashTrieMap<A, K, V>(clz);
    }

    public static <K, V> Supplier<Dictionary<K, V>> hashtableConstructor(
            Supplier<Dictionary<K, V>> constructor) {
        return () -> new ChainingHashTable<K, V>(constructor);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <K, V> Supplier<Dictionary<K, V>> binarySearchTreeConstructor() {
        return () -> new BinarySearchTree();
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <K, V> Supplier<Dictionary<K, V>> avlTreeConstructor() {
        return () -> new AVLTree();
    }


    public static void main(String[] args) {
        try {
            WordSuggestor suggestions = new WordSuggestor("corpus/eggs.txt", 2, -1,
                    NGramTester.trieConstructor(NGram.class),
                    NGramTester.trieConstructor(AlphabeticString.class));
            System.out.println(suggestions);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
