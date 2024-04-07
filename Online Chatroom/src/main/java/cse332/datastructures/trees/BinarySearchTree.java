package cse332.datastructures.trees;

import cse332.datastructures.containers.Item;
import cse332.interfaces.misc.ComparableDictionary;
import cse332.interfaces.misc.SimpleIterator;
import cse332.interfaces.worklists.WorkList;
import datastructures.worklists.ArrayStack;

import java.lang.reflect.Array;
import java.util.Iterator;

/**
 * BinarySearchTree implements the ComparableDictionary interface using a binary
 * search tree. Notice that the key type must be Comparable.
 */
public class BinarySearchTree<K extends Comparable<? super K>, V>
        extends ComparableDictionary<K, V> {
    // The root of the BST. Root is null if and only if the tree is empty.
    // This MUST be used as your root for any class that extends this
    protected BSTNode root;

    /**
     * Create an empty binary search tree.
     */
    public BinarySearchTree() {
        super();
        this.root = null;
    }

    /**
     * Inner class to represent a node in the tree. Each node includes a data of
     * type E and an integer count. The class is protected so that subclasses of
     * BinarySearchTree can access it.
     */
    public class BSTNode extends Item<K, V> {
        public BSTNode[] children; // The children of this node.

        /**
         * Create a new data node.
         *
         * @param key
         *            key with which the specified value is to be associated
         * @param value
         *            data element to be stored at this node.
         */
        @SuppressWarnings("unchecked")
        public BSTNode(K key, V value) {
            super(key, value);
            this.children = (BSTNode[]) Array.newInstance(BSTNode.class, 2);
        }
    }

    protected BSTNode find(K key, V value) {
        BSTNode prev = null;
        BSTNode current = this.root;

        int child = -1;

        while (current != null) {
            int direction = Integer.signum(key.compareTo(current.key));

            // We found the key!
            if (direction == 0) {
                return current;
            }
            else {
                // direction + 1 = {0, 2} -> {0, 1}
                child = Integer.signum(direction + 1);
                prev = current;
                current = current.children[child];
            }
        }

        // If value is not null, we need to actually add in the new value
        if (value != null) {
            current = new BSTNode(key, null);
            if (this.root == null) {
                this.root = current;
            }
            else {
                assert(child >= 0); // child should have been set in the loop
                                    // above
                prev.children[child] = current;
            }
            this.size++;
        }

        return current;
    }

    @Override
    public V find(K key) {
        if (key == null) {
            throw new IllegalArgumentException();
        }
        BSTNode result = find(key, null);
        if (result == null) {
            return null;
        }
        return result.value;
    }

    @Override
    public V insert(K key, V value) {
        if (key == null || value == null) {
            throw new IllegalArgumentException();
        }
        BSTNode current = find(key, value);
        V oldValue = current.value;
        current.value = value;
        return oldValue;
    }

    @Override
    public Iterator<Item<K, V>> iterator() {
        return new BSTIterator();
    }

    private class BSTIterator extends SimpleIterator<Item<K, V>> {
        private BSTNode current;
        private final WorkList<BSTNode> nodes;

        public BSTIterator() {
            this.nodes = new ArrayStack<BSTNode>();
            if (BinarySearchTree.this.root != null) {
                this.current = BinarySearchTree.this.root;
            }
        }

        @Override
        public boolean hasNext() {
            return this.current != null || this.nodes.hasWork();
        }

        @Override
        public Item<K, V> next() {
            // Go left until we hit null
            while (this.current != null) {
                this.nodes.add(this.current);
                this.current = this.current.children[0];
            }

            this.current = this.nodes.next();
            Item<K, V> value = new Item<K, V>(this.current);
            this.nodes.add(this.current.children[1]);
            this.current = this.nodes.next();

            return value;
        }
    }
}
