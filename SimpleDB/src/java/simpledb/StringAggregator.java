package simpledb;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Knows how to compute some aggregate over a set of StringFields.
 */
public class StringAggregator implements Aggregator {

    private static final long serialVersionUID = 1L;

    private int gbField;
    private Type gbFieldType;

    private HashMap<Field, Integer> groups;

    /**
     * Aggregate constructor
     * @param gbfield the 0-based index of the group-by field in the tuple, or NO_GROUPING if there is no grouping
     * @param gbfieldtype the type of the group by field (e.g., Type.INT_TYPE), or null if there is no grouping
     * @param afield the 0-based index of the aggregate field in the tuple
     * @param what aggregation operator to use -- only supports COUNT
     * @throws IllegalArgumentException if what != COUNT
     */

    public StringAggregator(int gbfield, Type gbfieldtype, int afield, Op what) {
        if (what != Op.COUNT) {
            throw new IllegalArgumentException("You can't do that with strings...");
        }

        this.gbField = gbfield;
        this.gbFieldType = gbfieldtype;

        this.groups = new HashMap<>();
    }

    /**
     * Merge a new tuple into the aggregate, grouping as indicated in the constructor
     * @param tup the Tuple containing an aggregate field and a group-by field
     */
    public void mergeTupleIntoGroup(Tuple tup) {
        Field key = null;
        if (gbField != NO_GROUPING) {
            key = tup.getField(gbField);
        }
        if (groups.containsKey(key)) {
            int val = groups.get(key) + 1;
            groups.put(key, val);
        } else {
            groups.put(key, 1);
        }
    }

    /**
     * Create a OpIterator over group aggregate results.
     *
     * @return a OpIterator whose tuples are the pair (groupVal,
     *   aggregateVal) if using group, or a single (aggregateVal) if no
     *   grouping. The aggregateVal is determined by the type of
     *   aggregate specified in the constructor.
     */
    public OpIterator iterator() {
        ArrayList<Tuple> results = new ArrayList<>();
        TupleDesc td;

        if (gbField == NO_GROUPING) {
            td = new TupleDesc(new Type[]{Type.INT_TYPE});
        } else {
            td = new TupleDesc(new Type[]{gbFieldType, Type.INT_TYPE});
        }

        for (Map.Entry<Field, Integer> entry : groups.entrySet()) {
            Tuple tuple = new Tuple(td);
            if (gbField == NO_GROUPING) {
                tuple.setField(0, new IntField(entry.getValue()));
            } else {
                tuple.setField(0, entry.getKey());
                tuple.setField(1, new IntField(entry.getValue()));
            }
            results.add(tuple);
        }
        return new TupleIterator(td, results);
    }
}
