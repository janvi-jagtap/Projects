package solvers;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;
import cse332.interfaces.BellmanFordSolver;
import main.Parser;
import paralleltasks.ArrayCopyTask;
import paralleltasks.RelaxInTask;
import paralleltasks.RelaxOutTaskBad;

import java.util.List;
import java.util.Map;

public class InParallel implements BellmanFordSolver {

    public List<Integer> solve(int[][] adjMatrix, int source) {
        List<Map<Integer, Integer>> g = Parser.parseInverse(adjMatrix);

        //Initialization
        int[] dist = new int[g.size()];
        int[] pred = new int[g.size()];

        for (int i = 0; i < g.size(); i++) {
            dist[i] = GraphUtil.INF;
            pred[i] = -1;
        }

        dist[source] = 0;

        int[] distCopy = new int[g.size()];

        //Relaxing edges
        for (int i = 0; i < g.size(); i++) {
            ArrayCopyTask.copy(dist, distCopy);
            RelaxInTask.parallel(dist, distCopy, pred, g);
        }

        //Finding negative cost-cycle
        return GraphUtil.getCycle(pred);
    }

}