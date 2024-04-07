package main;

import cse332.graph.GraphUtil;
import cse332.interfaces.BellmanFordSolver;
import solvers.OutSequential;

public class Main {

    /**
     * Use this method to test your BellmanFordSolver implementation.
     */
    public static void main(String[] arg) {
        BellmanFordSolver bfs = new OutSequential();
        int n = 10;
        int[][] g = GraphUtil.generate(n, 0.3, 0.4, 8, 16, -8, 0, 332);
        GraphUtil.printAdjMatrix(g);
        System.out.println(bfs.solve(g, 0));
    }

}
