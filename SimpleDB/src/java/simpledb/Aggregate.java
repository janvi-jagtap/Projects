package simpledb;

import java.util.*;

/**
 * The Aggregation operator that computes an aggregate (e.g., sum, avg, max,
 * min). Note that we only support aggregates over a single column, grouped by a
 * single column.
 */
public class Aggregate extends Operator {

    private static final long serialVersionUID = 1L;

    private  OpIterator child;
    private int aField;
    private int gField;
    private Aggregator.Op aop;

    private Aggregator aggregator;
    private OpIterator iterator;

    /**
     * Constructor.
     * 
     * Implementation hint: depending on the type of afield, you will want to
     * construct an {@link IntegerAggregator} or {@link StringAggregator} to help
     * you with your implementation of readNext().
     * 
     * 
     * @param child
     *            The OpIterator that is feeding us tuples.
     * @param afield
     *            The column over which we are computing an aggregate.
     * @param gfield
     *            The column over which we are grouping the result, or -1 if
     *            there is no grouping
     * @param aop
     *            The aggregation operator to use
     */
    public Aggregate(OpIterator child, int afield, int gfield, Aggregator.Op aop) {
	    this.child = child;
        this.aField = afield;
        this.gField = gfield;
        this.aop = aop;
    }

    /**
     * @return If this aggregate is accompanied by a groupby, return the groupby
     *         field index in the <b>INPUT</b> tuples. If not, return
     *         {@link simpledb.Aggregator#NO_GROUPING}
     * */
    public int groupField() {
        return gField;
    }

    /**
     * @return If this aggregate is accompanied by a group by, return the name
     *         of the groupby field in the <b>OUTPUT</b> tuples. If not, return
     *         null;
     * */
    public String groupFieldName() {
        if (gField == -1) {
            return null;
        } else {
            return child.getTupleDesc().getFieldName(gField);
        }
    }

    /**
     * @return the aggregate field
     * */
    public int aggregateField() {
        return aField;
    }

    /**
     * @return return the name of the aggregate field in the <b>OUTPUT</b>
     *         tuples
     * */
    public String aggregateFieldName() {
        return child.getTupleDesc().getFieldName(aField);
    }

    /**
     * @return return the aggregate operator
     * */
    public Aggregator.Op aggregateOp() {
        return aop;
    }

    public static String nameOfAggregatorOp(Aggregator.Op aop) {
	    return aop.toString();
    }

    public void open() throws NoSuchElementException, DbException,
	    TransactionAbortedException {
        super.open();
        child.open();

        Type aFieldType = child.getTupleDesc().getFieldType(aField);
        Type gbFieldType = null;
        if (gField != -1) {
            gbFieldType = child.getTupleDesc().getFieldType(gField);
        }

        if (aFieldType == Type.INT_TYPE) {
            aggregator = new IntegerAggregator(gField, gbFieldType, aField, aop);
        } else {
            aggregator = new StringAggregator(gField, gbFieldType, aField, aop);
        }

        while (child.hasNext()) {
            aggregator.mergeTupleIntoGroup(child.next());
        }

        iterator = aggregator.iterator();
        iterator.open();
    }

    /**
     * Returns the next tuple. If there is a group by field, then the first
     * field is the field by which we are grouping, and the second field is the
     * result of computing the aggregate. If there is no group by field, then
     * the result tuple should contain one field representing the result of the
     * aggregate. Should return null if there are no more tuples.
     */
    protected Tuple fetchNext() throws TransactionAbortedException, DbException {
        if (iterator != null && iterator.hasNext()) {
            return iterator.next();
        }
        return null;
    }

    public void rewind() throws DbException, TransactionAbortedException {
        iterator.rewind();
    }

    /**
     * Returns the TupleDesc of this Aggregate. If there is no group by field,
     * this will have one field - the aggregate column. If there is a group by
     * field, the first field will be the group by field, and the second will be
     * the aggregate value column.
     * 
     * The name of an aggregate column should be informative. For example:
     * "aggName(aop) (child_td.getFieldName(afield))" where aop and afield are
     * given in the constructor, and child_td is the TupleDesc of the child
     * iterator.
     */
    public TupleDesc getTupleDesc() {
        TupleDesc childTd = child.getTupleDesc();

        Type[] types;
        String[] names;

        if (gField == -1) {
            types = new Type[]{Type.INT_TYPE};

            String fieldName = childTd.getFieldName(aField);
            if (fieldName != null) {
                names = new String[]{nameOfAggregatorOp(aop) + " (" + childTd.getFieldName(aField) + ")"};
            } else {
                names = new String[]{null};
            }
        } else {
            types = new Type[]{childTd.getFieldType(gField), Type.INT_TYPE};

            String gbFieldName = childTd.getFieldName(gField);
            String aFieldName = childTd.getFieldName(aField);

            names = new String[2];
            names[0] = gbFieldName;

            if (aFieldName != null) {
                names[1] = nameOfAggregatorOp(aop) + " (" + aFieldName + ")";
            } else {
                names[1] = null;
            }
        }
        return new TupleDesc(types, names);
    }

    public void close() {
	    super.close();
        child.close();
        if (iterator != null) {
            iterator.close();
        }
    }

    @Override
    public OpIterator[] getChildren() {
	    return new OpIterator[]{child};
    }

    @Override
    public void setChildren(OpIterator[] children) {
	    if (children.length != 1) {
            throw new IllegalArgumentException("There should only be one child");
        }
        this.child = children[0];
    }
    
}
