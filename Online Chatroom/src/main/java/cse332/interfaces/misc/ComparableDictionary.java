package cse332.interfaces.misc;

/**
 * A ComparableDictionary is a Dictionary in which the keys are comparable.
 *
 * @param <K>
 *            the type of keys maintained by this map
 * @param <V>
 *            the type of mapped values
 *
 * @author Adam Blank
 */
public abstract class ComparableDictionary<K extends Comparable<? super K>, V>
        extends DeletelessDictionary<K, V> {
}
