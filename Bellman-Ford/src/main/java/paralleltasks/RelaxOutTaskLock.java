package paralleltasks;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;
import java.util.concurrent.locks.ReentrantLock;

public class RelaxOutTaskLock extends RecursiveAction {

    public static final ForkJoinPool pool = new ForkJoinPool();
    public static final int CUTOFF = 2;
    private final int lo, hi;
    private final int[] dist, distCopy, pred;
    private final List<Map<Integer, Integer>> g;
    private final ReentrantLock[] locks;


    public RelaxOutTaskLock(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g, ReentrantLock[] locks) {
        this.lo = lo;
        this.hi = hi;
        this.dist = dist;
        this.distCopy = distCopy;
        this.pred = pred;
        this.g = g;
        this.locks = locks;
    }

    protected void compute() {
        if (hi - lo < CUTOFF) {
            sequential(lo, hi, dist, distCopy, pred, g, locks);
        }
        else {
            int mid = lo + (hi - lo) / 2;
            RelaxOutTaskLock left = new RelaxOutTaskLock(lo, mid, dist, distCopy, pred, g, locks);
            RelaxOutTaskLock right = new RelaxOutTaskLock(mid, hi, dist, distCopy, pred, g, locks);
            left.fork();
            right.compute();
            left.join();
        }
    }

    public static void sequential(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g, ReentrantLock[] locks) {
        for (int j = lo; j < hi; j++) {
            for (int k: g.get(j).keySet()) {
                int weight = g.get(j).get(k);
                locks[k].lock();
                try {
                    if (distCopy[j] != GraphUtil.INF && distCopy[j] + weight < dist[k]) {
                        dist[k] = distCopy[j] + weight;
                        pred[k] = j;
                    }
                }
                finally {
                    locks[k].unlock();
                }
            }
        }
    }

    public static void parallel(int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g, ReentrantLock[] locks) {
        pool.invoke(new RelaxOutTaskLock(0, g.size(), dist, distCopy, pred, g, locks));
    }
}
