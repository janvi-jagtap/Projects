package datastructures.worklists;

import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.worklists.PriorityWorkList;

import java.util.NoSuchElementException;

/**
 * See cse332/interfaces/worklists/PriorityWorkList.java
 * for method specifications.
 */
public class MinFourHeapComparable<E extends Comparable<E>> extends PriorityWorkList<E> {
    /* Do not change the name of this field; the tests rely on it to work correctly. */
    private E[] data;
    int index;

    public MinFourHeapComparable() {
        data = createArray(10);
        index = 0;
    }
    @SuppressWarnings("unchecked")
    private E[] createArray(int size) {
        return (E[]) new Comparable[size];
    }
    @Override
    public boolean hasWork() {
        return index != 0;
    }

    @Override
    public void add(E work) {
        if (index == data.length) {
            int newSize = data.length * 2;
            E[] newArray = createArray(newSize);
            for (int i = 0; i < data.length; i++) {
                newArray[i] = data[i];
            }
            data = newArray;
        }
        data[index] = work;
        if (index > 0) {
            int childIndex = index;
            int parentIndex;

            while ((parentIndex = getParentIndex(childIndex)) != -1
                    && data[parentIndex].compareTo(data[childIndex]) > 0) {
                swap(parentIndex, childIndex);
                childIndex = parentIndex;
            }
        }
        index++;
    }

    private int getParentIndex(int childIndex) {
        int parentIndex;
        if (childIndex == 0) {
            return -1;
        }
        else if (childIndex % 4 == 0) {
            parentIndex = (childIndex / 4) - 1;
        }
        else {
            parentIndex = childIndex / 4;
        }
        return parentIndex;
    }

    @Override
    public E peek() {
        if (!this.hasWork()) {
            throw new NoSuchElementException("This worklist is empty");
        }

        return data[0];
    }

    @Override
    public E next() {
        if (!this.hasWork()) {
            throw new NoSuchElementException("This worklist is empty");
        }

        E work = data[0];
        int indexAdded = 0;
        index--;

        if (index == 0) {
           data[0] = null;
        }
        else {
            E lastWork = data[index];
            data[index] = null;
            data[0] = lastWork;

            int childIndex;

            while ((childIndex = findMinChildIndex(indexAdded)) != -1
                    && data[indexAdded].compareTo(data[childIndex]) > 0) {
                swap(indexAdded, childIndex);
                indexAdded = childIndex;
            }

        }
        return work;
    }

    private void swap(int i, int j) {
        E temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }

    private int findMinChildIndex(int parentIndex) {
        int startChildIndex = 4 * parentIndex + 1;
        int endChildIndex = Math.min(startChildIndex + 3, index - 1);

        if (startChildIndex >= index) {
            return -1;
        }

        int minChildIndex = startChildIndex;
        for (int i = startChildIndex + 1; i <= endChildIndex; i++) {
            if (data[i].compareTo(data[minChildIndex]) < 0) {
                minChildIndex = i;
            }
        }
        return minChildIndex;
    }

    @Override
    public int size() {
        return index;
    }

    @Override
    public void clear() {
       data = createArray(10);
       index = 0;
    }
}
