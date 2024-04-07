package p2.sorts;

import cse332.exceptions.NotYetImplementedException;
import datastructures.worklists.MinFourHeap;

import java.util.Comparator;

public class TopKSort {
    public static <E extends Comparable<E>> void sort(E[] array, int k) {
        sort(array, k, (x, y) -> x.compareTo(y));
    }


    public static <E> void sort(E[] array, int k, Comparator<E> comparator) {
        MinFourHeap<E> minHeap = new MinFourHeap<>(comparator);
        if (k >= array.length) {
            k = array.length;
        }
        for (int i = 0; i < array.length; i++) {
            if (minHeap.size() != k) {
                minHeap.add(array[i]);
            }
            else {
                if (comparator.compare(array[i], minHeap.peek()) > 0) {
                    minHeap.next();
                    minHeap.add(array[i]);
                }
            }
        }
        for (int i = 0; i < array.length; i++) {
            if (i < k) {
                array[i] = minHeap.next();
            }
            else {
                array[i] = null;
            }
        }
    }

}
