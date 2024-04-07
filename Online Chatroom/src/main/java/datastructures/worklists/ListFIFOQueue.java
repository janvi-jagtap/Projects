package datastructures.worklists;

import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.worklists.FIFOWorkList;

import java.util.NoSuchElementException;

/**
 * See cse332/interfaces/worklists/FIFOWorkList.java
 * for method specifications.
 */
public class ListFIFOQueue<E> extends FIFOWorkList<E> {
    public node head;
    public node end;
    public int size;

    public ListFIFOQueue() {
        head = null;
        end = null;
        size = 0;
    }

    @Override
    public void add(E work) {
        if (head == null) {
            head = new node(work, null);
        }
        else if (head.next == null){
            head.next = new node(work, null);
            end = head.next;
        }
        else {
            end.next = new node(work, null);
            end = end.next;
        }
        size++;
    }

    @Override
    public E peek() {
        if (head == null) {
            throw new NoSuchElementException("WorkList is empty");
        }
        return head.work;
    }

    @Override
    public E next() {
        if (head == null) {
            throw new NoSuchElementException("WorkList is empty");
        }
        E work = head.work;
        head = head.next;
        size--;
        return work;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public void clear() {
        head = null;
        end = null;
        size = 0;
    }

    private class node {
        public node next;
        public E work;

        public node(E work, node next) {
            this.next = next;
            this.work = work;
        }

    }


}
