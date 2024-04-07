package cse332.sorts;

import java.util.Comparator;

public class InsertionSort {
    public static <E extends Comparable<E>> void sort(E[] array) {
        sort(array, (x, y) -> x.compareTo(y));
    }

    public static <E> void sort(E[] array, Comparator<E> comparator) {
        for (int i = 1; i < array.length; i++) {
            E x = array[i];
            int j;
            for (j=i-1; j>=0; j--) {
                if (comparator.compare(x, array[j]) >= 0) { break; }
                array[j + 1] = array[j];
            }
            array[j + 1] = x;
        }
    }
}
