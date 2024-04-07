package provided;

import cse332.types.AlphabeticString;
import datastructures.dictionaries.HashTrieMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class HashTrieMapTests {

    /**
     * Tests if insert, find, and findPrefix work in general.
     */
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insertFindFindPrefix_fewElements_correctStructure() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        String[] words = {"dog", "doggy", "doge", "dragon", "cat", "draggin"};
        String[] invalid = {"d", "cataract", "", "do"};
        addAll(STUDENT, words);
        assertTrue(containsAllPaths(STUDENT, words));
        assertTrue(doesNotContainAll(STUDENT, invalid));
    }

    /**
     * Test findPrefix more rigorously.
     */
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_findPrefix_fewElements_correctStructure() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        String[] words = {"dog", "doggy", "doge", "dragon", "cat", "draggin"};
        addAll(STUDENT, words);

        assertTrue(containsAllPrefixes(STUDENT, "d", "", "do"));
        assertTrue(doesNotContainAllPrefixes(STUDENT, "batarang", "dogee", "dragging"));
    }

    /**
     * Tests that trying to find a non-existent entity does the correct thing
     */
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_finds_nonexistentKey_doesNotCrash() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        addAll(STUDENT, "foo", "bar", "baz");
        assertNull(STUDENT.find(a("orangutan")));
        assertNull(STUDENT.find(a("z")));
        assertNull(STUDENT.find(a("ba")));
        assertNull(STUDENT.find(a("bazz")));
        assertFalse(STUDENT.findPrefix(a("boor")));
        assertFalse(STUDENT.findPrefix(a("z")) );
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_finds_nullKey_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(IllegalArgumentException.class, () -> {
            STUDENT.find(null);
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_findPrefix_nullKey_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(IllegalArgumentException.class, () -> {
            STUDENT.findPrefix(null);
        });
    }

    /**
     * Tests that inserts correctly wipe out old values.
     */
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insert_fewElements_valueReplaced() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        AlphabeticString key = a("myKey");
        assertNull(STUDENT.insert(key, "foo"));
        assertEquals("foo", STUDENT.insert(key, "bar"));
        assertEquals("bar", STUDENT.insert(key, "baz"));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insert_nullKey_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(IllegalArgumentException.class, () -> {
            STUDENT.insert(null, "foo");
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insert_nullValue_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(IllegalArgumentException.class, () -> {
            STUDENT.insert(a("foo"), null);
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_delete_oneElement_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(UnsupportedOperationException.class, () -> {
            STUDENT.insert(a("foo"), "doo");
            STUDENT.delete(a("foo"));
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_clear_oneElement_throwsException() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        assertThrows(UnsupportedOperationException.class, () -> {
            STUDENT.insert(a("foo"), "doo");
            STUDENT.clear();
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insert_fewElements_correctInternalStructure() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        STUDENT.insert(a(""), "A");
        STUDENT.insert(a("foo"), "B");
        STUDENT.insert(a("fez"), "C");
        STUDENT.insert(a("fezzy"), "D");
        STUDENT.insert(a("jazz"), "E");
        STUDENT.insert(a("jazzy"), "F");

        MockNode fullExpected = node("A")
                .branch('f', node()
                        .branch('o', node()
                                .branch('o', node("B")))
                        .branch('e', node()
                                .branch('z', node("C")
                                        .branch('z', node()
                                                .branch('y', node("D"))))))
                .branch('j', node()
                        .branch('a', node()
                                .branch('z', node()
                                        .branch('z', node("E")
                                                .branch('y', node("F"))))));
        assertTrue(equals(fullExpected, getField(STUDENT, "root")));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_insertFindFindPrefix_manyElements_correctStructure() {
        HashTrieMap<Character, AlphabeticString, String> STUDENT = new HashTrieMap<>(AlphabeticString.class);
        // Should contain 30 characters
        char[] symbols = "abcdefghijklmnopqrstuvwxyz!@#$".toCharArray();
        long i = 0;
        for (char a : symbols) {
            for (char b : symbols) {
                for (char c : symbols) {
                    for (char d : symbols) {
                        Character[] word = new Character[]{a, b, c, d};
                        STUDENT.insert(new AlphabeticString(word), "" + i);
                        i += 1;
                    }
                }
            }
        }

        for (char a : symbols) {
            for (char b : symbols) {
                assertTrue(STUDENT.findPrefix(new AlphabeticString(new Character[]{a, b})));
            }
        }

        i = 0;
        for (char a : symbols) {
            for (char b : symbols) {
                for (char c : symbols) {
                    for (char d : symbols) {
                        Character[] word = new Character[]{a, b, c, d};
                        assertEquals("" + i, STUDENT.find(new AlphabeticString(word)));
                        i += 1;
                    }
                }
            }
        }
    }

    protected static boolean equals(MockNode expected, HashTrieMap<Character, AlphabeticString, String>.HashTrieNode student) {
        if (expected == null && student == null) {
            return true;
        } else if (expected == null || student == null) {
            // If only one of the two is null
            return false;
        } else if (expected.value != null && !expected.value.equals(student.value)) {
            // If values don't match
            return false;
        } else // If number of pointers is not the same
            if (expected.value == null && student.value != null) {
            // If only one of the values are null
            return false;
        } else return expected.pointers.size() == student.pointers.size();
    }

    protected static MockNode node() {
        return new MockNode();
    }

    protected static MockNode node(String value) {
        return new MockNode(value);
    }

    protected static class MockNode {
        public Map<Character, MockNode> pointers;
        public String value;

        public MockNode() {
            this(null);
        }

        public MockNode(String value) {
            this.pointers = new HashMap<>();
            this.value = value;
        }

        public MockNode branch(char c, MockNode child) {
            this.pointers.put(c, child);
            return this;
        }
    }

    /**
     * Converts a String into an AlphabeticString
     */
    private static AlphabeticString a(String s) {
        return new AlphabeticString(s);
    }

    /**
     * Checks if the trie contains the word and the expected value, and that all prefixes of
     * the word exist in the trie.
     */
    private static boolean containsPath(HashTrieMap<Character, AlphabeticString, String> trie, String word, String expectedValue) {
        AlphabeticString key = a(word);

        boolean valueCorrect = expectedValue.equals(trie.find(key));
        boolean fullWordIsPrefix = trie.findPrefix(key);
        boolean invalidWordDoesNotExist = trie.find(a(word + "$")) == null;

        if (!valueCorrect || !fullWordIsPrefix || !invalidWordDoesNotExist) {
            return false;
        }

        return allPrefixesExist(trie, word);
    }

    /**
     * Checks if the trie contains the word, and that all prefixes of the word exist in the trie.
     *
     * Assumes that the expected value is word.toUpperCase().
     */
    private static boolean containsPath(HashTrieMap<Character, AlphabeticString, String> trie, String word) {
        return containsPath(trie, word, word.toUpperCase());
    }

    /**
     * Returns true if all prefixes of a word exist in the trie.
     *
     * That is, if we do `trie.insert(new AlphabeticString("dog"), "some-value")`, this method
     * would check to see if "dog", "do", "d", and "" are all prefixes of the trie.
     */
    private static boolean allPrefixesExist(HashTrieMap<Character, AlphabeticString, String> trie, String word) {
        String accum = "";
        for (char c : word.toCharArray()) {
            accum += c;
            if (!trie.findPrefix(a(accum))) {
                return false;
            }
        }
        return true;
    }

    private static boolean containsAllPaths(HashTrieMap<Character, AlphabeticString, String> trie, String... words) {
        for (String word : words) {
            if (!containsPath(trie, word)) {
                return false;
            }
        }
        return true;
    }

    private static boolean doesNotContainAll(HashTrieMap<Character, AlphabeticString, String> trie, String... words) {
        for (String word : words) {
            if (trie.find(a(word)) != null) {
                return false;
            }
        }
        return true;
    }

    private static boolean containsAllPrefixes(HashTrieMap<Character, AlphabeticString, String> trie, String... words) {
        for (String word : words) {
            if (!trie.findPrefix(a(word))) {
                return false;
            }
        }
        return true;
    }

    private static boolean doesNotContainAllPrefixes(HashTrieMap<Character, AlphabeticString, String> trie, String... words) {
        for (String word : words) {
            if (trie.findPrefix(a(word))) {
                return false;
            }
        }
        return true;
    }

    private static void addAll(HashTrieMap<Character, AlphabeticString, String> trie, String... words) {
        for (String word : words) {
            trie.insert(a(word), word.toUpperCase());
        }
    }

    protected <T> T getField(Object o, String fieldName) {
        try {
            Field field = o.getClass().getSuperclass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object f = field.get(o);
            return (T) f;
        } catch (Exception var6) {
            try {
                Field field = o.getClass().getDeclaredField(fieldName);
                field.setAccessible(true);
                Object f = field.get(o);
                return (T) f;
            } catch (Exception var5) {
                return null;
            }
        }
    }
}
