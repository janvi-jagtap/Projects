package provided;

import datastructures.worklists.CircularArrayFIFOQueue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class CircularArrayHashCodeTests {

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_hashCode_fewElements_equal() {
		CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
		CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
		for (int i = 0; i < 3; i++) {
			l1.add("a");
			l2.add("a");
		}
		assertEquals(l1.hashCode(), l2.hashCode());
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_hashCode_fewElements_notEqual() {
		CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
		CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
		l1.add("a");
		l1.add("a");
		l1.add("b");
		l2.add("a");
		l2.add("a");
		l2.add("a");
        assertNotEquals(l1.hashCode(), l2.hashCode());
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_hashCode_fewElements2_notEqual() {
		CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
		CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
		l1.add("a");
		l1.add("a");
		l1.add("a");
		l1.add("a");
		l2.add("a");
		l2.add("a");
		l2.add("a");
        assertNotEquals(l1.hashCode() , l2.hashCode());
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_hashCode_fewElements3_notEqual() {
		CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
		CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
		l1.add("a");
		l1.add("b");
		l1.add("c");
		l2.add("c");
		l2.add("b");
		l2.add("a");
        assertNotEquals(l1.hashCode() , l2.hashCode());
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_equalHashCode_fewElements2_equal() {
		CircularArrayFIFOQueue<String> l1 = new CircularArrayFIFOQueue<>(10);
		CircularArrayFIFOQueue<String> l2 = new CircularArrayFIFOQueue<>(10);
		l1.add("a");
		l1.add("b");
		l2.add("a");
		l2.add("b");
		assertEquals(l1 , l2);
		assertEquals(l1.hashCode() , l2.hashCode());
	}
}
