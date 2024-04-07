package datastructures.worklists;

import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.worklists.LIFOWorkList;

import java.util.NoSuchElementException;

/**
 * See cse332/interfaces/worklists/LIFOWorkList.java
 * for method specifications.
 */
public class ArrayStack<E> extends LIFOWorkList<E> {
    E[] array;
    int index;

    public ArrayStack() {
        this.array = createArray(10);
        this.index = -1;
    }

    @SuppressWarnings("unchecked")
    private E[] createArray(int size) {
        return (E[])new Object[size];
    }

    @Override
    public void add(E work) {
        if (this.index + 1 == this.array.length) {
            int newSize = this.array.length * 2;
            E[] arr = createArray(newSize);
            for (int i = 0; i < this.array.length; i++) {
                arr[i] = this.array[i];
            }
            this.array = arr;

        }
        this.array[this.index + 1] = work;
        this.index++;
    }

    @Override
    public E peek() {
        if (this.index == -1) {
            throw new NoSuchElementException("The Worklist is Empty");
        }
        return this.array[this.index];
    }

    @Override
    public E next() {
        if (this.index == -1) {
            throw new NoSuchElementException("The Worklist is Empty");
        }
        E work = this.array[this.index];
        this.array[this.index] = null;
        this.index--;
        return work;
    }

    @Override
    public int size() {
        return this.index + 1;
    }

    @Override
    public void clear() {
        this.array = createArray(10);
        index = -1;
    }

}
