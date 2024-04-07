package cse332.interfaces;

import java.util.List;

public interface BellmanFordSolver {

    /**
     * Determine if the graph contains any negative-cost cycles by constructing a predecessor array
     * and using GraphUtil.getCycle to generate the resulting List (see GraphUtil.java)
     * @param adjMatrix adjacency matrix
     * @param source starting node
     * @return cycle, as a list, or empty list if there is no cycle
     */
    List<Integer> solve(int[][] adjMatrix, int source);

}
