package cse332.interfaces.misc;

/**
 * A DeletelessDictionary is a Dictionary in which deletion is unsupported.
 *
 * @param <K>
 *            the type of keys maintained by this map
 * @param <V>
 *            the type of mapped values
 *
 * @author Adam Blank
 */
public abstract class DeletelessDictionary<K, V> extends Dictionary<K, V> {
    /**
     * Removes the mapping for the specified key from this map if present.
     *
     * @param key
     *            key whose mapping is to be removed from the map
     * @throws IllegalArgumentException
     *             if key is null.
     */
    @Override
    public final void delete(K key) {
        throw new UnsupportedOperationException(
                "DeletelessDictionary does not support deletion");
    }

    /**
     * Resets the state of this map to be the same as if the constructor were
     * just called.
     */
    @Override
    public final void clear() {
        throw new UnsupportedOperationException(
                "DeletelessDictionary does not support clearing");
    }
}
