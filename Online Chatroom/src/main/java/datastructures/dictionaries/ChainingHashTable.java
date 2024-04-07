package datastructures.dictionaries;

import cse332.datastructures.containers.Item;
import cse332.exceptions.NotYetImplementedException;
import cse332.interfaces.misc.DeletelessDictionary;
import cse332.interfaces.misc.Dictionary;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.function.Supplier;

/**
 * - You must implement a generic chaining hashtable. You may not
 *   restrict the size of the input domain (i.e., it must accept
 *   any key) or the number of inputs (i.e., it must grow as necessary).
 *
 * - ChainingHashTable should rehash as appropriate (use load factor as shown in lecture!).
 *
 * - ChainingHashTable must resize its capacity into prime numbers via given PRIME_SIZES list.
 *   Past this, it should continue to resize using some other mechanism (primes not necessary).
 *
 * - When implementing your iterator, you should NOT copy every item to another
 *   dictionary/list and return that dictionary/list's iterator.
 */
public class ChainingHashTable<K, V> extends DeletelessDictionary<K, V> {
    private Supplier<Dictionary<K, V>> newChain;
    private Dictionary<K, V>[] table;
    private int items;
    private int indexOfPrime;
    public int capacity;



    static final int[] PRIME_SIZES =
            {11, 23, 47, 97, 193, 389, 773, 1549, 3089, 6173, 12347, 24697, 49393, 98779, 197573, 395147};

    public ChainingHashTable(Supplier<Dictionary<K, V>> newChain) {
        this.newChain = newChain;
        this.table = new Dictionary[11];
        this.items = 0;
        this.indexOfPrime = 0;
        this.capacity = 11;
    }

    @Override
    public V insert(K key, V value) {
        //If the load factor is greater than or equal to 0.7 rehash
        //Else just add it with the hashcode
        if ((items / this.capacity) >= 2) {
            if (this.capacity < 395147) {
                this.capacity = PRIME_SIZES[indexOfPrime + 1];
                this.indexOfPrime++;
            }
            else {
                this.capacity = this.capacity * 2;
            }
            Dictionary<K, V>[] newTable = new Dictionary[this.capacity];
            for (Dictionary<K, V> chain: this.table) {
                if (chain != null) {
                    Iterator<Item<K, V>> iterator = chain.iterator();
                    while (iterator.hasNext()) {
                        Item<K, V> item = iterator.next();
                        int index = Math.abs(item.key.hashCode() % this.capacity);

                        if (newTable[index] == null) {
                            newTable[index] = newChain.get();
                        }
                        newTable[index].insert(item.key, item.value);
                    }
                }
            }
            this.table = newTable;
        }
        //Insert the item
        int index = Math.abs(key.hashCode() % this.capacity);
        if (this.table[index] == null) {
            this.table[index] = newChain.get();
        }

        //Check for the key already being in that list
        Iterator<Item<K, V>> chainIterator = this.table[index].iterator();
        while (chainIterator.hasNext()) {
            Item<K, V> item = chainIterator.next();
            if (item.key.equals(key)) {
                this.items--;
            }
        }
        this.table[index].insert(key, value);
        this.items++;
        super.size = this.items;
        return value;
    }

    @Override
    public V find(K key) {
        int index = Math.abs(key.hashCode() % this.capacity);
        if (this.table[index] == null) {
            return null;
        }
        else {
            Iterator<Item<K, V>> iterator = this.table[index].iterator();
            while (iterator.hasNext()) {
                Item<K, V> item = iterator.next();
                if (item.key.equals(key)) {
                    return item.value;
                }
            }

        }
        return null;
    }

    @Override
    public Iterator<Item<K, V>> iterator() {
        return new ChainingHashTableIterator();
    }

    private class ChainingHashTableIterator implements Iterator<Item<K, V>> {
        private int chainIndex;
        private Iterator<Item<K, V>> chainIterator;

        public ChainingHashTableIterator() {
            this.chainIndex = 0;
            findNextNonEmptyChain();
        }

        private void findNextNonEmptyChain() {
            while (chainIndex < table.length && (table[chainIndex] == null
                    || !table[chainIndex].iterator().hasNext())) {
                chainIndex++;
            }

            if (chainIndex < table.length) {
                this.chainIterator = table[chainIndex].iterator();
            }
            else {
                this.chainIterator = null;
            }
        }

        public boolean hasNext() {
           if (chainIterator != null) {
               if (chainIterator.hasNext()) {
                   return true;
               }
           }
           chainIndex++;
           findNextNonEmptyChain();
           return chainIterator != null;
        }

        public Item<K, V> next() {
            if (!this.hasNext()) {
                throw new NoSuchElementException();
            }
            return this.chainIterator.next();

        }
    }


    /**
     * Temporary fix so that you can debug on IntelliJ properly despite a broken iterator
     * Remove to see proper String representation (inherited from Dictionary)
     */
    @Override
    public String toString() {
        return "ChainingHashTable String representation goes here.";
    }
}
