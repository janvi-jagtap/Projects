package solvers;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;
import cse332.interfaces.BellmanFordSolver;
import main.Parser;
import paralleltasks.ArrayCopyTask;
import paralleltasks.RelaxOutTaskBad;
import paralleltasks.RelaxOutTaskLock;

import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

public class OutParallelLock implements BellmanFordSolver {

    public List<Integer> solve(int[][] adjMatrix, int source) {
        List<Map<Integer, Integer>> g = Parser.parse(adjMatrix);

        //Initialization
        int[] dist = new int[g.size()];
        int[] pred = new int[g.size()];
        ReentrantLock[] locks = new ReentrantLock[g.size()];

        for (int i = 0; i < g.size(); i++) {
            dist[i] = GraphUtil.INF;
            pred[i] = -1;
            locks[i] = new ReentrantLock();
        }

        dist[source] = 0;

        int[] distCopy = new int[g.size()];

        //Relaxing edges
        for (int i = 0; i < g.size(); i++) {
            ArrayCopyTask.copy(dist, distCopy);
            RelaxOutTaskLock.parallel(dist, distCopy, pred, g, locks);
        }

        //Finding negative cost-cycle
        return GraphUtil.getCycle(pred);
    }

}
