package datastructures.worklists;

import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.worklists.PriorityWorkList;

import java.util.Comparator;
import java.util.NoSuchElementException;

/**
 * See cse332/interfaces/worklists/PriorityWorkList.java
 * for method specifications.
 */
public class MinFourHeap<E> extends PriorityWorkList<E> {
    /* Do not change the name of this field; the tests rely on it to work correctly. */
    private E[] data;
    private Comparator<E> c;
    int index;

    public MinFourHeap(Comparator<E> c) {
        this.data = createArray(10);
        this.c = c;
        this.index = 0;

    }
    private E[] createArray(int size) {
        return (E[]) new Object[size];
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
                    && c.compare(data[parentIndex], data[childIndex])  > 0) {
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
            if (c.compare(data[i], data[minChildIndex]) < 0) {
                minChildIndex = i;
            }
        }
        return minChildIndex;
    }


    @Override
    public E peek() {
        if (!this.hasWork()) {
            throw new NoSuchElementException("Tst is empty");
        }

        return data[0];
    }

    @Override
    public E next() {
        if (!this.hasWork()) {
            throw new NoSuchElementException("Ts empty");
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
                    && c.compare(data[indexAdded], data[childIndex]) > 0) {
                swap(indexAdded, childIndex);
                indexAdded = childIndex;
            }

        }
        return work;
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
