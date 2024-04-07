package solvers;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;
import cse332.interfaces.BellmanFordSolver;
import main.Parser;

import java.util.List;
import java.util.Map;

public class OutSequential implements BellmanFordSolver {

    public List<Integer> solve(int[][] adjMatrix, int source) {
        List<Map<Integer, Integer>> g = Parser.parse(adjMatrix);

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
            for (int j = 0; j < g.size(); j++) {
                distCopy[j] = dist[j];
            }
            for (int j = 0; j < g.size(); j++) {
                for (int k: g.get(j).keySet()) {
                    int weight = g.get(j).get(k);
                    if (distCopy[j] != GraphUtil.INF && distCopy[j] + weight < dist[k]) {
                        dist[k] = distCopy[j] + weight;
                        pred[k] = j;
                    }
                }
            }
        }

        //Finding negative cost-cycle
        return GraphUtil.getCycle(pred);
    }

}
