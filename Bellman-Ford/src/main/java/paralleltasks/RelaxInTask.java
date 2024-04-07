package paralleltasks;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

public class RelaxInTask extends RecursiveAction {

    public static final ForkJoinPool pool = new ForkJoinPool();
    public static final int CUTOFF = 2;

    private final int lo, hi;
    private final int[] dist, distCopy, pred;
    private final List<Map<Integer, Integer>> g;

    public RelaxInTask(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
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
            RelaxInTask left = new RelaxInTask(lo, mid, dist, distCopy, pred, g);
            RelaxInTask right = new RelaxInTask(mid, hi, dist, distCopy, pred, g);
            left.fork();
            right.compute();
            left.join();
        }
    }

    public static void sequential(int lo, int hi, int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
        for (int i = lo; i < hi;  i++) {
            int minDistance = GraphUtil.INF;
            for (int k: g.get(i).keySet()) {
                int weight = g.get(i).get(k);
                if (distCopy[k] != GraphUtil.INF && distCopy[k] + weight < dist[i] && distCopy[k] + weight <= minDistance) {
                    minDistance = distCopy[k] + weight;
                    pred[i] = k;
                }
            }
            dist[i] = minDistance;
        }
    }

    public static void parallel(int[] dist, int[] distCopy, int[] pred, List<Map<Integer, Integer>> g) {
        pool.invoke(new RelaxInTask(0, g.size(), dist, distCopy, pred, g));
    }

}
