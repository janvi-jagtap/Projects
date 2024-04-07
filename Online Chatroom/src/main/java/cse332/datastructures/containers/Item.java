package cse332.datastructures.containers;

import java.util.Objects;

/**
 * Simple class to hold a piece of data and its value.
 * 
 * @param <K>
 *            type of the key
 * @param <V>
 *            type of the value
 */
public class Item<K, V> {
    /**
     * The key whose value we are recording.
     */
    public K key;

    /**
     * The value we are recording.
     */
    public V value;

    /**
     * Create a data count.
     * 
     * @param key
     *            the key we are recording.
     * @param value
     *            the value of the key we are recording.
     */
    public Item(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public Item(Item<K, V> item) {
        this(item.key, item.value);
    }

    @Override
    public String toString() {
        return this.key + "=" + this.value + "";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item<?, ?> item = (Item<?, ?>) o;
        return Objects.equals(key, item.key) &&
                Objects.equals(value, item.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key, value);
    }
}
