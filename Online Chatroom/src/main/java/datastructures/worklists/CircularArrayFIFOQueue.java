package datastructures.worklists;

import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.worklists.FixedSizeFIFOWorkList;

import java.util.NoSuchElementException;

/**
 * See cse332/interfaces/worklists/FixedSizeFIFOWorkList.java
 * for method specifications.
 */
public class CircularArrayFIFOQueue<E extends Comparable<E>> extends FixedSizeFIFOWorkList<E> {
    E[] array;
    int frontIndex;
    int backIndex;
    public CircularArrayFIFOQueue(int capacity) {
        super(capacity);
        this.array = createArray(capacity);
        frontIndex = -1;
        backIndex = 0;

    }

    @SuppressWarnings("unchecked")
    private E[] createArray(int size) {
        return (E[])new Comparable[size];
    }

    @Override
    public void add(E work) {
        if (this.size() == super.capacity()) {
            throw new IllegalStateException("This worklist is full");
        }
        if (this.frontIndex == -1) {
            this.frontIndex = 0;
        }
        if (backIndex == this.array.length) {
            backIndex = 0;
        }
        this.array[backIndex] = work;
        backIndex++;
    }

    @Override
    public E peek() {
        if (this.size() == 0) {
            throw new NoSuchElementException("The worklist is empty");
        }
        else {
            return this.array[this.frontIndex];
        }
    }

    @Override
    public E peek(int i) {
        if (this.size() == 0) {
            throw new NoSuchElementException("This worklist is empty");
        }
        else if (i < 0 || i >= this.array.length) {
            throw new IllegalStateException("This index is out of bounds");
        }
        else {
            return this.array[this.frontIndex + i];
        }
    }

    @Override
    public E next() {
        if(this.size() == 0) {
            throw new NoSuchElementException("The worklist is empty");
        }
        E work = this.array[this.frontIndex];
        this.array[this.frontIndex] = null;
        if (this.frontIndex == this.array.length - 1) {
            if (this.backIndex == 0) {
                this.frontIndex = -1;
            } else {
                this.frontIndex = 0;
            }
        }
        else {
            this.frontIndex++;
        }
        return work;
    }

    @Override
    public void update(int i, E value) {
        if (this.size() == 0) {
            throw new NoSuchElementException("This worklist is empty");
        }
        else if (i < frontIndex || i >= backIndex) {
            throw new IllegalStateException("This index is out of bounds");
        }
        else {
            this.array[i] = value;
        }
    }

    @Override
    public int size() {
        if ((this.frontIndex == -1 && this.backIndex == 0) || array[this.frontIndex] == null) {
            return 0;
        }
        else if (this.backIndex <= this.frontIndex) {
            int firstHalf = super.capacity() - this.frontIndex;
            return firstHalf + this.backIndex;
        }
        else {
            return this.backIndex - this.frontIndex;
        }
    }

    @Override
    public void clear() {
        this.array = createArray(super.capacity());
        this.frontIndex = -1;
        this.backIndex = 0;
    }

    @Override
    public int compareTo(FixedSizeFIFOWorkList<E> other) {
        if (other == null) {
            throw new NullPointerException("The worklist passed in is null");
        }

        CircularArrayFIFOQueue<E> otherQueue = (CircularArrayFIFOQueue<E>) other;

        int size = 0;
        if (this.size() < otherQueue.size()) {
            size = this.size();
        }
        else {
            size = otherQueue.size();
        }

        for (int i = 0; i < size; i++) {
            E elementOriginal = this.peek(i);
            E elementOther = otherQueue.peek(i);

            int comparison = elementOriginal.compareTo(elementOther);

            if (comparison != 0) {
                return comparison;
            }
        }


        return this.size() - otherQueue.size();
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean equals(Object obj) {
        // You will finish implementing this method in project 2. Leave this method unchanged for project 1.
        if (this == obj) {
            return true;
        } else if (!(obj instanceof FixedSizeFIFOWorkList<?>)) {
            return false;
        } else {
            // Uncomment the line below for p2 when you implement equals
             FixedSizeFIFOWorkList<E> other = (FixedSizeFIFOWorkList<E>) obj;

             if (this.compareTo(other) != 0) {
                 return false;
             }
        }
        return true;
    }

    public int hashCode() {
        int index = super.capacity();
         index = 31 * index + frontIndex + backIndex;
         for (int i = 0; i < this.size(); i++) {
             E element = this.array[(frontIndex + i) % this.array.length];
             if (i % 2 == 0 && element != null) {
                 index = 31 * index + element.hashCode();
             }
             else if (element != null) {
                 index = 29 * index + element.hashCode();
             }
         }
         index = 31 * index + backIndex;
         return index;
    }
}
