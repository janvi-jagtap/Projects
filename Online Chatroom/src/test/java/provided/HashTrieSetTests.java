package provided;


import cse332.types.AlphabeticString;
import datastructures.dictionaries.HashTrieSet;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
public class HashTrieSetTests {

    /**
     * Test to check if HashTrieSet has been copied over from P1
     * */
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_isHashTrieSetAvailable() {
        HashTrieSet<Character, AlphabeticString> STUDENT = new HashTrieSet<>(AlphabeticString.class);
        String[] words = {"dog", "doggy", "doge", "dragon", "cat", "draggin"};
        String[] invalid = {"d", "cataract", "", "do"};

        for (String word: words) {
            STUDENT.add(a(word));
        }

        assertEquals(6, STUDENT.size());

        for (String word: words) {
            assertTrue(STUDENT.contains(a(word)));
        }

        for (String invalid_word: invalid) {
            assertFalse(STUDENT.contains(a(invalid_word)));
        }
    }

    private static AlphabeticString a(String s) {
        return new AlphabeticString(s);
    }
}
