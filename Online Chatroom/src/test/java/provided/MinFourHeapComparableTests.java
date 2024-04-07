package provided;

import cse332.interfaces.worklists.PriorityWorkList;
import cse332.interfaces.worklists.WorkList;
import datastructures.worklists.MinFourHeapComparable;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class MinFourHeapComparableTests {
    private static final int SEED = 42;

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_hasWork_empty_noWork() {
        WorkList<Integer> STUDENT_INT = new MinFourHeapComparable<>();

        assertFalse(STUDENT_INT.hasWork());
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_hasWork_oneElement_hasWork() {
        WorkList<Integer> STUDENT_INT = new MinFourHeapComparable<>();

        STUDENT_INT.add(1);
        assertTrue(STUDENT_INT.hasWork());
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_hasWork_manyElements_noWork() {
        WorkList<Double> STUDENT_DOUBLE = new MinFourHeapComparable<>();

        for (int i = 0; i < 1000; i++) {
            STUDENT_DOUBLE.add(Math.random());
        }
        for (int i = 0; i < 1000; i++) {
            STUDENT_DOUBLE.next();
        }
        assertFalse(STUDENT_DOUBLE.hasWork());
    }
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_peek_empty_exceptionThrown() {
        WorkList<Integer> STUDENT_INT = new MinFourHeapComparable<>();
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_INT.peek();
        });

        addAndRemove(STUDENT_INT, 42, 10);
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_INT.peek();
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_next_empty_exceptionThrown() {
        WorkList<Integer> STUDENT_INT = new MinFourHeapComparable<>();
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_INT.next();
        });

        addAndRemove(STUDENT_INT, 42, 10);
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_INT.next();
        });
    }
    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_clear_fewElements_empty() {
        WorkList<String> STUDENT_STR = new MinFourHeapComparable<>();
        addAll(STUDENT_STR, new String[]{"Beware", "the", "Jabberwock", "my", "son!"});

        assertTrue(STUDENT_STR.hasWork());
        assertEquals(5, STUDENT_STR.size());

        STUDENT_STR.clear();
        assertFalse(STUDENT_STR.hasWork());
        assertEquals(0, STUDENT_STR.size());
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_STR.peek();
        });
        assertThrows(NoSuchElementException.class, () -> {
            STUDENT_STR.next();
        });
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_add_fewElements_correct() {
        PriorityWorkList<String> heap = new MinFourHeapComparable<>();
        String[] tests = { "a", "b", "c", "d", "e" };
        for (int i = 0; i < 5; i++) {
            String str = tests[i] + "a";
            heap.add(str);
        }


        for (int i = 0; i < 5; i++) {
            String str_heap = heap.next();
            String str = (char) ('a' + i) + "a";
            assertEquals(str, str_heap);
        }
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_addPeekNext_fewElements_correctOrdering() {
        PriorityWorkList<String> ordered = new MinFourHeapComparable<>();
        PriorityWorkList<String> reversed = new MinFourHeapComparable<>();
        PriorityWorkList<String> random = new MinFourHeapComparable<>();

        addAll(ordered, new String[]{"a", "b", "c", "d", "e"});
        addAll(reversed, new String[]{"e", "d", "c", "b", "a"});
        addAll(random, new String[]{"d", "b", "c", "e", "a"});

        assertTrue(isSame("a", ordered.peek(), reversed.peek(), random.peek()));
        assertTrue(isSame("a", ordered.next(), reversed.next(), random.next()));
        assertTrue(isSame("b", ordered.next(), reversed.next(), random.next()));

        addAll(ordered, new String[] {"a", "a", "b", "c", "z"});
        addAll(reversed, new String[] {"z", "c", "b", "a", "a"});
        addAll(random, new String[] {"c", "z", "a", "b", "a"});

        String[] expected = new String[] {"a", "a", "b", "c", "c", "d", "e", "z"};
        for (String e : expected) {
            assertTrue(isSame(e, ordered.peek(), reversed.peek(), random.peek()));
            assertTrue(isSame(e, ordered.next(), reversed.next(), random.next()));
        }
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_addNext_manyElements_correctOrdering() {
        PriorityWorkList<String> heap = new MinFourHeapComparable<>();
        int n = 10000;

        // Add them
        for (int i = 0; i < n; i++) {
            String str = String.format("%05d", i * 37 % n);
            heap.add(str);
        }
        // Delete them all
        for (int i = 0; i < n; i++) {
            String s = heap.next();
            assertEquals(i , Integer.parseInt(s));
        }
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_peekNextCustomComparator_manyElements_correctOrdering() {
        Random RAND = new Random(SEED);
        PriorityWorkList<Coordinate> student = new MinFourHeapComparable<>();
        Queue<Coordinate> reference = new PriorityQueue<>();

        for (int i = 0; i < 10000; i++) {
            Coordinate coord = new Coordinate(RAND.nextInt(10000) - 5000, RAND.nextInt(10000) - 5000);
            student.add(coord);
            reference.add(coord);
        }
        assertEquals(reference.size(), student.size());

        while (!reference.isEmpty()) {
            assertEquals(reference.peek() , student.peek());
            assertEquals(reference.remove() , student.next());
        }
    }

    @Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
    public void test_addNext_severalElements_correctStructure() {
        PriorityWorkList<Integer> heap = new MinFourHeapComparable<>();
        addAll(heap, new Integer[] {10, 10, 15, 1, 17, 16, 100, 101, 102, 103, 105, 106, 107, 108});

        Object[] heapData = getField(heap, "data");
        String heapStr = Arrays.toString(heapData);
        String heapExp = "[1, 10, 15, 10, 17, 16, 100, 101, 102, 103, 105, 106, 107, 108";

        heap.next();
        heap.next();
        heap.next();

        Object[] heapData2 = getField(heap, "data");
        String heapStr2 = Arrays.toString(heapData2);
        String heapExp2 = "[15, 16, 103, 107, 17, 108, 100, 101, 102, 106, 105,";

        assertTrue(heapStr.contains(heapExp));
        assertTrue(heapStr2.contains(heapExp2));
    }

    private boolean isSame(String... args) {
        String first = args[0];
        for (String arg : args) {
            if (!first.equals(arg)) {
                return false;
            }
        }
        return true;
    }

    public static class Coordinate implements Comparable<Coordinate> {
        private final int x;
        private final int y;

        public Coordinate(int x, int y) {
            this.x = x;
            this.y = y;
        }

        // What exactly this comparable method is doing is somewhat arbitrary.
        public int compareTo(Coordinate other) {
            if (this.x != other.x) {
                return this.x - other.x;
            } else {
                return this.y - other.y;
            }
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

    protected static <E> void addAll(WorkList<E> worklist, E[] values) {
        for (E value : values) {
            worklist.add(value);
        }
    }

    protected static <E> void addAndRemove(WorkList<E> worklist, E value, int amount) {
        for (int i = 0; i < amount; i++) {
            worklist.add(value);
        }
        for (int i = 0; i < amount; i++) {
            worklist.next();
        }
    }
}
