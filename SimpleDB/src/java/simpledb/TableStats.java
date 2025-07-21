package simpledb;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * TableStats represents statistics (e.g., histograms) about base tables in a
 * query. 
 * 
 * This class is not needed in implementing lab1 and lab2.
 */
public class TableStats {

    private static final ConcurrentHashMap<String, TableStats> statsMap = new ConcurrentHashMap<String, TableStats>();

    static final int IOCOSTPERPAGE = 1000;

    private final int tableId;

    private int ioCostPerPage;
    
    private int numPages;

    private int numTuples;

    private IntHistogram[] intHistograms;

    public static TableStats getTableStats(String tablename) {
        return statsMap.get(tablename);
    }

    public static void setTableStats(String tablename, TableStats stats) {
        statsMap.put(tablename, stats);
    }
    
    public static void setStatsMap(HashMap<String,TableStats> s)
    {
        try {
            java.lang.reflect.Field statsMapF = TableStats.class.getDeclaredField("statsMap");
            statsMapF.setAccessible(true);
            statsMapF.set(null, s);
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (SecurityException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

    }

    public static Map<String, TableStats> getStatsMap() {
        return statsMap;
    }

    public static void computeStatistics() {
        Iterator<Integer> tableIt = Database.getCatalog().tableIdIterator();

        System.out.println("Computing table stats.");
        while (tableIt.hasNext()) {
            int tableid = tableIt.next();
            TableStats s = new TableStats(tableid, IOCOSTPERPAGE);
            setTableStats(Database.getCatalog().getTableName(tableid), s);
        }
        System.out.println("Done.");
    }

    /**
     * Number of bins for the histogram. Feel free to increase this value over
     * 100, though our tests assume that you have at least 100 bins in your
     * histograms.
     */
    static final int NUM_HIST_BINS = 100;

    /**
     * Create a new TableStats object, that keeps track of statistics on each
     * column of a table
     * 
     * @param tableid
     *            The table over which to compute statistics
     * @param ioCostPerPage
     *            The cost per page of IO. This doesn't differentiate between
     *            sequential-scan IO and disk seeks.
     */
    public TableStats(int tableid, int ioCostPerPage) {
        this.tableId = tableid;
        this.ioCostPerPage = ioCostPerPage;

        // get the DbFile for the table
        DbFile dbFile = Database.getCatalog().getDatabaseFile(tableid);

        this.numPages = ((HeapFile) dbFile).numPages();

        TupleDesc tupleDesc = dbFile.getTupleDesc();
        int numFields = tupleDesc.numFields();
        this.intHistograms = new IntHistogram[numFields];

        int[] minValues = new int[numFields];
        int[] maxValues = new int[numFields];
        Arrays.fill(minValues, Integer.MAX_VALUE);
        Arrays.fill(maxValues, Integer.MIN_VALUE);

        DbFileIterator iterator = dbFile.iterator(new TransactionId());
        // first scan: calculate min and max values for each field
        try {
            iterator.open();
            while (iterator.hasNext()) {
                Tuple tuple = iterator.next();
                numTuples++;
                for (int i = 0; i < numFields; i++) {
                    if (tuple.getField(i) instanceof IntField) { // should always be ints for this lab
                        int value = ((IntField) tuple.getField(i)).getValue();
                        minValues[i] = Math.min(minValues[i], value);
                        maxValues[i] = Math.max(maxValues[i], value);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            iterator.close();
        }

        // initialize histograms with min and max values
        for (int i = 0; i < numFields; i++) {
            if (tupleDesc.getFieldType(i) == Type.INT_TYPE) {
                intHistograms[i] = new IntHistogram(NUM_HIST_BINS, minValues[i], maxValues[i]);
            }
        }

        // second scan: populate histograms
        try {
            iterator.open();
            while (iterator.hasNext()) {
                Tuple tuple = iterator.next();
                for (int i = 0; i < numFields; i++) {
                    if (tuple.getField(i) instanceof IntField) {
                        int value = ((IntField) tuple.getField(i)).getValue();
                        intHistograms[i].addValue(value);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            iterator.close();
        }
    }

    /**
     * Estimates the cost of sequentially scanning the file, given that the cost
     * to read a page is costPerPageIO. You can assume that there are no seeks
     * and that no pages are in the buffer pool.
     * 
     * Also, assume that your hard drive can only read entire pages at once, so
     * if the last page of the table only has one tuple on it, it's just as
     * expensive to read as a full page. (Most real hard drives can't
     * efficiently address regions smaller than a page at a time.)
     * 
     * @return The estimated cost of scanning the table.
     */
    public double estimateScanCost() {
        return this.numPages * this.ioCostPerPage;
    }

    /**
     * This method returns the number of tuples in the relation, given that a
     * predicate with selectivity selectivityFactor is applied.
     * 
     * @param selectivityFactor
     *            The selectivity of any predicates over the table
     * @return The estimated cardinality of the scan with the specified
     *         selectivityFactor
     */
    public int estimateTableCardinality(double selectivityFactor) {
        return (int) (totalTuples() * selectivityFactor);
    }

    /**
     * The average selectivity of the field under op.
     * @param field
     *        the index of the field
     * @param op
     *        the operator in the predicate
     * The semantic of the method is that, given the table, and then given a
     * tuple, of which we do not know the value of the field, return the
     * expected selectivity. You may estimate this value from the histograms.
     * */
    public double avgSelectivity(int field, Predicate.Op op) {
        double totalSelectivity = 0.0;
        for (int i = 0; i < NUM_HIST_BINS; i++) {
            Field constant = new IntField(i);
            double selectivity = estimateSelectivity(field, op, constant);
            totalSelectivity += selectivity;
        }
        return totalSelectivity / NUM_HIST_BINS;
    }

    /**
     * Estimate the selectivity of predicate <tt>field op constant</tt> on the
     * table.
     * 
     * @param field
     *            The field over which the predicate ranges
     * @param op
     *            The logical operation in the predicate
     * @param constant
     *            The value against which the field is compared
     * @return The estimated selectivity (fraction of tuples that satisfy) the
     *         predicate
     */
    public double estimateSelectivity(int field, Predicate.Op op, Field constant) {
        if (constant instanceof IntField) { // should always be ints but check just in case
            int value = ((IntField) constant).getValue();

            IntHistogram histogram = intHistograms[field];
            if (histogram == null) {
                throw new IllegalArgumentException("No histogram found for field: " + field);
            }
            
            return histogram.estimateSelectivity(op, value);
        }
        return -1.0;
    }

    /**
     * return the total number of tuples in this table
     * */
    public int totalTuples() {
        return numTuples;
    }

}
