package provided;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import p2.sorts.TopKSort;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TopKSortTests {

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_sort_integerSorted_correctSort() {
		int K = 4;
		Integer[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
		Integer[] arr_sorted = {7, 8, 9, 10};
		TopKSort.sort(arr, K, Integer::compareTo);
		for(int i = 0; i < K; i++) {
			assertEquals(arr_sorted[i], arr[i]);
		}
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_sort_integerRandom_correctSort() {
		int K = 4;
		Integer[] arr = {3, 1, 4, 5, 9, 2, 6, 7, 8};
		Integer[] arr_sorted = {6, 7, 8, 9};
		TopKSort.sort(arr, K, Integer::compareTo);
		for(int i = 0; i < K; i++) {
			assertEquals(arr_sorted[i], arr[i]);
		}
	}
}
