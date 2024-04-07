package cse332.datastructures.worklists;

import cse332.interfaces.worklists.WorkList;
import p2.sorts.QuickSort;

public class BinarySearchWorkList<E extends Comparable<E>> extends WorkList<E> {
    private int lo, hi;
    private int location;
    private final E[] work;
    private E item;

    public BinarySearchWorkList(E[] work) {
        this.work = work;
        QuickSort.sort(work);
        this.location = -1;
    }

    public void setItem(E item) {
        this.lo = 0;
        this.location = this.work.length / 2;
        this.hi = this.work.length;
        this.item = item;
    }

    @Override
    public boolean hasWork() {
        return this.location >= 0;
    }

    @Override
    public void add(E work) {
        throw new UnsupportedOperationException();
    }

    @Override
    public E peek() {
        return this.work[this.location];
    }

    @Override
    public E next() {
        if (this.location < 0) {
            return null;
        }
        E next = this.work[this.location];
        int result = this.item.compareTo(next);
        if (result == 0) {
            this.location = -1;
            return next;
        }

        // item < next
        if (result < 0) {
            this.hi = this.location;
        }
        // item > next
        else {
            this.lo = this.location + 1;
        }

        if (this.hi - this.lo < 1) {
            this.location = -1;
        }
        else {
            this.location = (this.hi - this.lo) / 2;
        }

        return next;
    }

    @Override
    public int size() {
        return this.work.length;
    }

    @Override
    public void clear() {
        throw new UnsupportedOperationException();
    }
}
