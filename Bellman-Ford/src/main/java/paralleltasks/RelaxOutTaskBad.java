package paralleltasks;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

public class RelaxOutTaskBad extends RecursiveAction {

    public static final ForkJoinPool pool = new ForkJoinPool();
    public static final int CUTOFF = 2;

    private final int lo, hi;
    private final int[] dist, distCopy, pred;
    private final List<Map<Integer, Integer>> g;


    public RelaxOutTaskBad(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
        this.lo = lo;
        this.hi = hi;
        this.dist = dist;
        this.distCopy = distCopy;
        this.pred = pred;
        this.g = g;
    }

    protected void compute() {
        if (hi - lo < CUTOFF) {
            sequential(lo, hi, dist, distCopy, pred, g);
        }
        else {
            int mid = lo + (hi - lo) / 2;
            RelaxOutTaskBad left = new RelaxOutTaskBad(lo, mid, dist, distCopy, pred, g);
            RelaxOutTaskBad right = new RelaxOutTaskBad(mid, hi, dist, distCopy, pred, g);
            left.fork();
            right.compute();
            left.join();
        }
    }

    public static void sequential(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
        for (int j = lo; j < hi; j++) {
            for (int k: g.get(j).keySet()) {
                int weight = g.get(j).get(k);
                if (distCopy[j] != GraphUtil.INF && distCopy[j] + weight < dist[k]) {
                    dist[k] = distCopy[j] + weight;
                    pred[k] = j;
                }
            }
        }
    }

    public static void parallel(int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
        pool.invoke(new RelaxOutTaskBad(0, g.size(), dist, distCopy, pred, g));
    }

}
