package p2.sorts;

import cse332.exceptions.NotYetImplementedException;
import datastructures.worklists.MinFourHeap;

import java.util.Comparator;

public class HeapSort {
    public static <E extends Comparable<E>> void sort(E[] array) {

        sort(array, (x, y) -> x.compareTo(y));
    }

    public static <E> void sort(E[] array, Comparator<E> comparator) {
        comparator = comparator.reversed();
        MinFourHeap maxHeap = new MinFourHeap(comparator);
        for (int i = 0; i < array.length; i++) {
            maxHeap.add(array[i]);
        }
        for (int i = array.length - 1; i >= 0; i--) {
            array[i] = (E) maxHeap.next();
        }

    }

}
