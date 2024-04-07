package provided;

import datastructures.worklists.CircularArrayFIFOQueue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CircularArrayComparatorTests {

    @Test
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_empty_equalTo() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);

        // Checks if comparing two empty CAFQ is the same as comparing 2 empty strings.
        assertEquals(Integer.signum("".compareTo("")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_sameElements_equalTo() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l1.add("b");

        l2.add("a");
        l2.add("b");

        assertEquals(Integer.signum("ab".compareTo("ab")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_differentElements_lessThan() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l1.add("b");

        l2.add("a");
        l2.add("b");
        l2.add("c");

        assertEquals(Integer.signum("ab".compareTo("abc")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_differentElements_greaterThan() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l1.add("b");
        l1.add("c");

        l2.add("a");
        l2.add("b");

        assertEquals(Integer.signum("abc".compareTo("ab")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_differentElements2_greaterThan() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l1.add("c");

        l2.add("a");
        l2.add("b");
        l2.add("c");

        assertEquals(Integer.signum("ac".compareTo("abc")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_differentElements3_greaterThan() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");

        l2.add("a");
        l2.add("a");

        assertEquals(Integer.signum("a".compareTo("aa")), Integer.signum(l1.compareTo(l2)));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareTo_transitive_correct() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l3 = new CircularArrayFIFOQueue<>(10);
        l1.add("abc");
        l2.add("def");
        l3.add("efg");

        assertTrue(l1.compareTo(l2) < 0, "\"abc\" should be less than \"def\"") ;
        assertTrue(l1.compareTo(l3) < 0, "\"abc\" should be less than \"efg\"");
        assertTrue(l2.compareTo(l3) < 0, "\"def\" should be less than \"efg\"");
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_compareToEquality_sameElements_sameResults() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l1.add("b");

        l2.add("a");
        l2.add("b");

        assertEquals(l1, l2);
        assertEquals(0, l1.compareTo(l2));
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_equals_sameElements_nothingHappens() {
        CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
        CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
        l1.add("a");
        l2.add("a");

        l1.equals(l2);
        assertEquals(1, l1.size());
    }
}
