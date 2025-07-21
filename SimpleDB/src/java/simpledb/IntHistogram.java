package simpledb;

/** A class to represent a fixed-width histogram over a single integer-based field.
 */
public class IntHistogram {

    private int[] buckets; // bucket values
    private int numBuckets; // number of buckets
    private int min; // min value in the histogram
    private int max; // max value in the histogram
    private int totalValues; // number of values added to the histogram

    /**
     * Create a new IntHistogram.
     * 
     * This IntHistogram should maintain a histogram of integer values that it receives.
     * It should split the histogram into "buckets" buckets.
     * 
     * The values that are being histogrammed will be provided one-at-a-time through the "addValue()" function.
     * 
     * Your implementation should use space and have execution time that are both
     * constant with respect to the number of values being histogrammed.  For example, you shouldn't 
     * simply store every value that you see in a sorted list.
     * 
     * @param buckets The number of buckets to split the input value into.
     * @param min The minimum integer value that will ever be passed to this class for histogramming
     * @param max The maximum integer value that will ever be passed to this class for histogramming
     */
    public IntHistogram(int buckets, int min, int max) {
        if (buckets <= 0 || min >= max) {
            throw new IllegalArgumentException("Invalid parameters for IntHistogram");
        }
        this.numBuckets = buckets;
        this.min = min;
        this.max = max;
        this.buckets = new int[buckets];
        this.totalValues = 0;
    }

    /**
     * Add a value to the set of values that you are keeping a histogram of.
     * @param v Value to add to the histogram
     */
    public void addValue(int v) {
        if (v < min || v > max) {
            throw new IllegalArgumentException("Value out of bounds for histogram");
        }

        // calculate bucket index for v
        int bucketIndex = (int) ((double) (v - min) / (max - min + 1) * numBuckets);
        if (bucketIndex >= numBuckets) {
            bucketIndex = numBuckets - 1; // ensure we don't go out of bounds
        }

        buckets[bucketIndex]++;
        totalValues++;
    }

    /**
     * Estimate the selectivity of a particular predicate and operand on this table.
     * 
     * For example, if "op" is "GREATER_THAN" and "v" is 5, 
     * return your estimate of the fraction of elements that are greater than 5.
     * 
     * @param op Operator
     * @param v Value
     * @return Predicted selectivity of this particular operator and value
     */
    public double estimateSelectivity(Predicate.Op op, int v) {
        int bucketIndex = 0;
        if (v >= min && v <= max) {
            // calculate bucket index for v
            bucketIndex = (int) ((double) (v - min) / (max - min + 1) * numBuckets);
            if (bucketIndex >= numBuckets) {
                bucketIndex = numBuckets - 1; // ensure we don't go out of bounds
            }
        }

        double selectivity = 0.0;

        switch (op) {
            case EQUALS:
                if (v < min || v > max) {
                    return 0.0; // value is out of bounds
                }
                return (double) buckets[bucketIndex] / totalValues;
            case GREATER_THAN:
                if (v < min) {
                    return 1.0; // all values are greater than v
                } else if (v >= max) {
                    return 0.0; // no values are greater than v
                }
                return selectivityHelper(bucketIndex + 1, numBuckets, selectivity);
            case LESS_THAN:
                if (v <= min) {
                    return 0.0;
                } else if (v > max) {
                    return 1.0;
                }
                return selectivityHelper(0, bucketIndex, selectivity);
            case GREATER_THAN_OR_EQ:
                if (v < min) {
                    return 1.0;
                } else if (v > max) {
                    return 0.0;
                }
                return selectivityHelper(bucketIndex, numBuckets, selectivity);
            case LESS_THAN_OR_EQ:
                if (v < min) {
                    return 0.0;
                } else if (v >= max) {
                    return 1.0;
                }
                return selectivityHelper(0, bucketIndex + 1, selectivity);
            case NOT_EQUALS:
                if (v < min || v > max) {
                    return 1.0; // all values are not equal to v
                }
                return 1.0 - (double) buckets[bucketIndex] / totalValues;
            default:
                throw new UnsupportedOperationException("Unknown operation: " + op);
        }
    }

    private double selectivityHelper(int start, int end, double selectivity) {
        for (int i = start; i < end; i++) {
            selectivity += buckets[i];
        }
        return selectivity / totalValues;
    }
    
    /**
     * @return
     *     the average selectivity of this histogram.
     *     
     *     This is not an indispensable method to implement the basic
     *     join optimization. It may be needed if you want to
     *     implement a more efficient optimization
     * */
    public double avgSelectivity()
    {
        if (totalValues == 0) {
            return 0.0; // avoid division by zero
        }
        
        double totalSelectivity = 0.0;
        for (int i = 0; i < numBuckets; i++) {
            if (buckets[i] > 0) {
                double bucketWidth = (double) (max - min + 1) / numBuckets;
                totalSelectivity += (double) buckets[i] / totalValues / bucketWidth;
            }
        }
        
        return totalSelectivity / numBuckets;
    }
    
    /**
     * @return A string describing this histogram, for debugging purposes
     */
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("IntHistogram: [");
        sb.append("Buckets: ").append(numBuckets).append(", ");
        sb.append("Min: ").append(min).append(", ");
        sb.append("Max: ").append(max).append(", ");
        sb.append("Total Values: ").append(totalValues).append(", ");
        sb.append("Bucket Counts: [");
        
        for (int i = 0; i < numBuckets; i++) {
            sb.append(buckets[i]);
            if (i < numBuckets - 1) {
                sb.append(", ");
            }
        }
        
        sb.append("]]");
        return sb.toString();
    }
}
