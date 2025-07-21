package simpledb;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Knows how to compute some aggregate over a set of IntFields.
 */
public class IntegerAggregator implements Aggregator {

    private static final long serialVersionUID = 1L;

    private int gbField;
    private Type gbFieldType;
    private int aField;
    private Op operation;

    private HashMap<Field, ArrayList<Integer>> groups;

    /**
     * Aggregate constructor
     * 
     * @param gbfield
     *            the 0-based index of the group-by field in the tuple, or
     *            NO_GROUPING if there is no grouping
     * @param gbfieldtype
     *            the type of the group by field (e.g., Type.INT_TYPE), or null
     *            if there is no grouping
     * @param afield
     *            the 0-based index of the aggregate field in the tuple
     * @param what
     *            the aggregation operator
     */

    public IntegerAggregator(int gbfield, Type gbfieldtype, int afield, Op what) {
        this.gbField = gbfield;
        this.gbFieldType = gbfieldtype;
        this.aField = afield;
        this.operation = what;
        this.groups = new HashMap<>();
    }

    /**
     * Merge a new tuple into the aggregate, grouping as indicated in the
     * constructor
     * 
     * @param tup
     *            the Tuple containing an aggregate field and a group-by field
     */
    public void mergeTupleIntoGroup(Tuple tup) {
        Field key = null;
        if (gbField != NO_GROUPING) {
            key = tup.getField(gbField);
        }
        IntField aggregateField = (IntField) tup.getField(aField);
        int val = aggregateField.getValue();

        if (groups.containsKey(key)) {
            groups.get(key).add(val);
        } else {
            ArrayList<Integer> list = new ArrayList<>();
            list.add(val);
            groups.put(key, list);
        }
    }

    /**
     * Create a OpIterator over group aggregate results.
     * 
     * @return a OpIterator whose tuples are the pair (groupVal, aggregateVal)
     *         if using group, or a single (aggregateVal) if no grouping. The
     *         aggregateVal is determined by the type of aggregate specified in
     *         the constructor.
     */
    public OpIterator iterator() {
        List<Tuple> results = new ArrayList<>();
        TupleDesc td;

        if (gbField == NO_GROUPING) {
            td = new TupleDesc(new Type[]{Type.INT_TYPE});
        } else {
            td = new TupleDesc(new Type[]{gbFieldType, Type.INT_TYPE});
        }

        for (Map.Entry<Field, ArrayList<Integer>> entry : groups.entrySet()) {
            Field key = entry.getKey();
            List<Integer> val = entry.getValue();

            // Compute values based on operator
            int result = 0;

            if (operation == Op.COUNT) {
                result = val.size();
            } else if (operation == Op.SUM) {
                for (int i = 0; i < val.size(); i++) {
                    result += val.get(i);
                }
            } else if (operation == Op.MIN) {
                result = val.get(0);
                for (int i = 0; i < val.size(); i++) {
                    if (val.get(i) < result) {
                        result = val.get(i);
                    }
                }
            } else if (operation == Op.MAX) {
                result = val.get(0);
                for (int i = 0; i < val.size(); i++) {
                    if (val.get(i) > result) {
                        result = val.get(i);
                    }
                }
            } else {
                for (int i = 0; i < val.size(); i++) {
                    result += val.get(i);
                }
                result /= val.size();
            }
            Tuple tuple = new Tuple(td);
            IntField iField = new IntField(result);
            if (gbField == NO_GROUPING) {
                tuple.setField(0, iField);
            } else {
                tuple.setField(0, key);
                tuple.setField(1, iField);
            }
            results.add(tuple);
        }

        return new TupleIterator(td, results);
    }
}
