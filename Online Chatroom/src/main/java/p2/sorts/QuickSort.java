package p2.sorts;

import cse332.exceptions.NotYetImplementedException;

import java.util.Comparator;

public class QuickSort {
    public static <E extends Comparable<E>> void sort(E[] array) {
        QuickSort.sort(array, (x, y) -> x.compareTo(y));
    }

    public static <E> void sort(E[] array, Comparator<E> comparator) {
        sortQuick(array, comparator, 0, array.length - 1);
    }

    private static <E> void sortQuick(E[] array, Comparator<E> comparator, int low, int high) {
        if (low < high) {
            int pivot = partition(array, comparator, low, high);

            sortQuick(array, comparator, low, pivot - 1);
            sortQuick(array, comparator, pivot + 1, high);
        }
    }

    private static <E> int partition(E[] array, Comparator<E> comparator, int low, int high) {
        int left = low + 1;
        int right = high;

        while (left < right) {
            if (comparator.compare(array[left], array[low]) > 0) {
                swap(right, left, array);
                right--;
            }
            else {
                left++;
            }
        }
        if (comparator.compare(array[left], array[low]) < 0) {
            swap(low, left, array);
            low = left;
        }
        else {
            swap(low, left - 1, array);
            low = left - 1;
        }
        return low;

    }

    private static <E> void swap(int i, int j, E[] array) {
        E temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

}
