package simpledb;

import java.io.IOException;

/**
 * The delete operator. Delete reads tuples from its child operator and removes
 * them from the table they belong to.
 */
public class Delete extends Operator {

    private static final long serialVersionUID = 1L;
    private TransactionId transactionId;
    private OpIterator child;
    private int deletedCount;
    private boolean hasDeleted = false;
    private Tuple result;

    /**
     * Constructor specifying the transaction that this delete belongs to as
     * well as the child to read from.
     * 
     * @param t
     *            The transaction this delete runs in
     * @param child
     *            The child operator from which to read tuples for deletion
     */
    public Delete(TransactionId t, OpIterator child) {
        this.transactionId = t;
        this.child = child;
    }

    public TupleDesc getTupleDesc() {
        Type[] types = new Type[1];
        types[0] = Type.INT_TYPE;
        String[] names = new String[1];
        names[0] = null;
        return new TupleDesc(types, names);
    }

    public void open() throws DbException, TransactionAbortedException {
        super.open();
        child.open();
    }

    public void close() {
        super.close();
        child.close();
    }

    public void rewind() throws DbException, TransactionAbortedException {
        child.rewind();
    }

    /**
     * Deletes tuples as they are read from the child operator. Deletes are
     * processed via the buffer pool (which can be accessed via the
     * Database.getBufferPool() method.
     * 
     * @return A 1-field tuple containing the number of deleted records.
     * @see Database#getBufferPool
     * @see BufferPool#deleteTuple
     */
    protected Tuple fetchNext() throws TransactionAbortedException, DbException {
        if (hasDeleted) {
            return null;
        }

        deletedCount = 0;
        while (child.hasNext()) {
            Tuple tuple = child.next();
            try {
                // Note for Janvi: I had to implement deleteTuple in BufferPool for this lab
                // (might need to talk about that in the writeup)
                Database.getBufferPool().deleteTuple(transactionId, tuple);
                deletedCount++;
            } catch (IOException e) {
                throw new DbException("Delete failed");
            }
        }

        result = new Tuple(getTupleDesc());
        result.setField(0, new IntField(deletedCount));
        hasDeleted = true;
        return result;
    }

    @Override
    public OpIterator[] getChildren() {
        return new OpIterator[] { this.child };
    }

    @Override
    public void setChildren(OpIterator[] children) {
        if (this.child != children[0]) {
            this.child = children[0];
        }
    }

}
