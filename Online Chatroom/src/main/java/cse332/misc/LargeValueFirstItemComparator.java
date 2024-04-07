package cse332.misc;

import cse332.datastructures.containers.Item;

import java.util.Comparator;

/**
 * A Comparator for Item<K, V> that sorts items first by VALUE, then by KEY.
 */
public class LargeValueFirstItemComparator<K extends Comparable<K>, V extends Comparable<V>>
        implements Comparator<Item<K, V>> {
    @Override
    public int compare(Item<K, V> e1, Item<K, V> e2) {
        int result = e2.value.compareTo(e1.value);
        if (result != 0) {
            return result;
        }
        return e1.key.compareTo(e2.key);
    }
}
