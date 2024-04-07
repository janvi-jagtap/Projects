package datastructures.dictionaries;

import cse332.datastructures.containers.Item;
import cse332.datastructures.trees.BinarySearchTree;
import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.misc.Dictionary;
import cse332.interfaces.misc.SimpleIterator;
import cse332.interfaces.trie.TrieMap;
import cse332.types.BString;
import datastructures.worklists.ArrayStack;

import java.util.*;
import java.util.Map.Entry;
import java.util.function.Supplier;

/**
 * See cse332/interfaces/trie/TrieMap.java
 * and cse332/interfaces/misc/Dictionary.java
 * for method specifications.
 */
public class HashTrieMap<A extends Comparable<A>, K extends BString<A>, V> extends TrieMap<A, K, V> {
    public class HashTrieNode extends TrieNode<ChainingHashTable<A, HashTrieNode>, HashTrieNode> {
        public HashTrieNode() {
            this(null);
        }

        public HashTrieNode(V value) {
            Supplier<Dictionary<A, HashTrieNode>> BST = BinarySearchTree::new;
            this.pointers = new ChainingHashTable<A, HashTrieNode>(BST);
            this.value = value;
        }

        @Override
        public Iterator<Entry<A, HashTrieNode>> iterator() {
            return new chainingHashTableIterator();
        }

        private class chainingHashTableIterator extends SimpleIterator<Entry<A, HashTrieNode>>{
            Iterator<Item<A, HashTrieNode>> it;
            private chainingHashTableIterator() {
                super();
                it = pointers.iterator();;
            }

            public boolean hasNext() {
                return it.hasNext();
            }

            public Entry<A, HashTrieNode> next() {
                if (!it.hasNext()) {
                    throw new NoSuchElementException();
                }
                Item<A, HashTrieNode> curr = it.next();
                A key = curr.key;
                HashTrieNode value = curr.value;
                return new AbstractMap.SimpleEntry<>(key, value);
            }
        }
    }

    public HashTrieMap(Class<K> KClass) {
        super(KClass);
        this.root = new HashTrieNode();
    }

    @Override
    public V insert(K key, V value) {
        if (key == null || value == null) {
            throw new IllegalArgumentException("The key and value cannot be null");
        }

        Iterator<A> keyIterator = key.iterator();
        HashTrieNode curr = (HashTrieNode) this.root;
        A currentKey = null;
        if (keyIterator.hasNext()) {
            currentKey = keyIterator.next();
        }

        V prevVal = null;

        while (keyIterator.hasNext()) {
            if (curr.pointers.find(currentKey) != null) {
                curr = curr.pointers.find(currentKey);
            }
            else {
                curr.pointers.insert(currentKey, new HashTrieNode());
                curr = curr.pointers.find(currentKey);
            }
            currentKey = keyIterator.next();
        }
        if (currentKey == null) {
            prevVal = root.value;
            root.value = value;
            if (prevVal == null) {
                super.size++;
            }
        }
        else if (curr.pointers.find(currentKey) != null) {
            prevVal = curr.pointers.find(currentKey).value;
            if (prevVal == null) {
                super.size++;
            }
            curr.pointers.find(currentKey).value = value;
        }
        else {
            curr.pointers.insert(currentKey, new HashTrieNode(value));
            super.size++;
        }
        return prevVal;
    }

    @Override
    public V find(K key) {
        if (key == null) {
            throw new IllegalArgumentException("Key value should not be null");
        }
        V value = null;
        Iterator<A> keyIterator = key.iterator();
        A currentKey = null;
        if (keyIterator.hasNext()) {
            currentKey = keyIterator.next();
        }
        HashTrieNode curr = (HashTrieNode) this.root;
        if (currentKey == null) {
            return root.value;
        }
        while (keyIterator.hasNext()) {
            if (curr == null || (curr.pointers.find(currentKey) == null)) {
                return null;
            }
            curr = curr.pointers.find(currentKey);
            currentKey = keyIterator.next();
        }
        if (curr != null && (curr.pointers.find(currentKey) != null)) {
            value = curr.pointers.find(currentKey).value;
        }
        return value;
    }

    @Override
    public boolean findPrefix(K key) {
        if (key == null) {
            throw new IllegalArgumentException("Key should not be null");
        }
        Iterator<A> keyIterator = key.iterator();
        HashTrieNode curr = (HashTrieNode) this.root;
        A currentKey = null;
        if (keyIterator.hasNext()) {
            currentKey = keyIterator.next();
        }

        while (keyIterator.hasNext()) {
            if (curr.pointers.find(currentKey) != null) {
                curr = curr.pointers.find(currentKey);
            }
            else {
                return false;
            }
            currentKey = keyIterator.next();
        }
        if (currentKey == null && !curr.pointers.isEmpty()) {
            return true;
        }
        return (curr.pointers.find(currentKey) != null);
    }

    @Override
    public void delete(K key) {
       throw new UnsupportedOperationException();
    }

    @Override
    public void clear() {
        HashTrieNode curr = (HashTrieNode) this.root;
        curr.pointers.clear();
    }

}
