package paralleltasks;

import cse332.exceptions.NotYetImplementedException;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

public class ArrayCopyTask extends RecursiveAction {

    public static final ForkJoinPool pool = new ForkJoinPool();
    public static final int CUTOFF = 2;

    public static void copy(int[] src, int[] dst) {
        pool.invoke(new ArrayCopyTask(src, dst, 0, src.length));
    }

    private final int[] src, dst;
    private final int lo, hi;

    public static void sequential(int[] src, int[] dst, int lo, int hi) {
        for (int i = lo; i < hi; i++) {
            dst[i] = src[i];
        }
    }

    public ArrayCopyTask(int[] src, int[] dst, int lo, int hi) {
        this.src = src;
        this.dst = dst;
        this.lo = lo;
        this.hi = hi;

    }

    @SuppressWarnings("ManualArrayCopy")
    protected void compute() {
        if (hi - lo < CUTOFF) {
            sequential(src, dst, lo, hi);
        }
        else {
            int mid = lo + (hi - lo) / 2;
            ArrayCopyTask left = new ArrayCopyTask(src, dst, lo, mid);
            ArrayCopyTask right = new ArrayCopyTask(src, dst, mid, hi);
            left.fork();
            right.compute();
            left.join();
        }
    }
}
