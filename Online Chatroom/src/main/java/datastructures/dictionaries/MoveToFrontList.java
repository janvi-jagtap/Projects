package datastructures.dictionaries;

import cse332.datastructures.containers.Item;
import cse332.datastructures.trees.BinarySearchTree;
import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.misc.DeletelessDictionary;
import cse332.interfaces.misc.SimpleIterator;
import cse332.interfaces.worklists.WorkList;
import datastructures.worklists.ArrayStack;
import datastructures.worklists.ListFIFOQueue;
import org.w3c.dom.Node;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * 1. The list is typically not sorted.
 * 2. Add new items to the front of the list.
 * 3. Whenever find or insert is called on an existing key, move it
 * to the front of the list. This means you remove the node from its
 * current position and make it the first node in the list.
 * 4. You need to implement an iterator. The iterator SHOULD NOT move
 * elements to the front.  The iterator should return elements in
 * the order they are stored in the list, starting with the first
 * element in the list. When implementing your iterator, you should
 * NOT copy every item to another dictionary/list and return that
 * dictionary/list's iterator.
 */
public class MoveToFrontList<K, V> extends DeletelessDictionary<K, V> {

    private node head;

    @Override
    public V insert(K key, V value) {
        if (key == null || value == null) {
            throw new IllegalArgumentException();
        }
        else if (head == null) {
            head = new node(key, value);
            this.size++;
            return null;
        }
        else if (head.key.equals(key)) {
            V oldValue = head.value;
            head.value = value;
            return oldValue;
        }
        else {
            node temp = head;
            while (temp.next != null && !temp.next.key.equals(key)) {
                temp = temp.next;
            }
            if (temp.next == null) {
                head = new node(key,value, head);
                this.size++;
                return null;
            }
            else {
                node curr = temp.next;
                temp.next = temp.next.next;
                V oldValue = curr.value;
                curr.value = value;
                curr.next = head;
                head = curr;
                return oldValue;
            }
        }
    }


    @Override
    public V find(K key) {
        if (key == null) {
            throw new IllegalArgumentException();
        }
        if (head == null) {
            return null;
        }
        if (head.key.equals(key)) {
            return head.value;
        }
        else {
            node temp = head;
            while (temp.next != null && !temp.next.key.equals(key)) {
                temp = temp.next;
            }
            if (temp.next == null) {
                return null;
            }
            else {
                node curr = temp.next;
                temp.next = temp.next.next;
                curr.next = head;
                head = curr;
                return curr.value;
            }
        }
    }


    @Override
    public Iterator<Item<K, V>> iterator() {
        return new MoveToFrontListIterator();
    }

    private class MoveToFrontListIterator extends SimpleIterator<Item<K,V>> {

        private node current = head;

        @Override
        public boolean hasNext() {
            return current != null;
        }

        public Item<K, V> next() {
            if (!this.hasNext()) {
                throw new NoSuchElementException();
            }
            else {
                Item<K, V> item = new Item<>(current.key, current.value);
                current = current.next;
                return item;
            }
        }
    }

    private class node {
        public node next;
        public K key;
        public V value;

        public node(K key, V value) {
            this.key = key;
            this.value = value;

        }

        public node(K key, V value, node next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }

    }
}
