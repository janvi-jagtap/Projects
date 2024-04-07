package cse332.graph;

import java.util.LinkedList;
import java.util.List;
import java.util.Random;

public class GraphUtil {

    public static final int INF = Integer.MAX_VALUE;

    /**
     * Random graph generator
     * @param n size of the graph
     * @param fp probability of each forward edge existing
     * @param bp probability of each backward edge existing
     * @param fmin minimum cost of forward edge
     * @param fmax maximum cost of forward edge
     * @param bmin minimum cost of backward edge
     * @param bmax maximum cost of backward edge
     * @param seed random seed
     * @return graph
     */
    public static int[][] generate(int n, double fp, double bp, int fmin, int fmax, int bmin, int bmax, int seed) {
        int[][] res = new int[n][n];
        Random r = seed == 0 ? new Random() : new Random(seed);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j == 0 || j == i)
                    res[i][j] = INF;
                else if (i == 0)
                    res[i][j] = 0;
                else if (i < j)
                    res[i][j] = r.nextDouble() < fp ? r.nextInt(fmax - fmin) + fmin : INF;
                else
                    res[i][j] = r.nextDouble() < bp ? r.nextInt(bmax - bmin) + bmin : INF;
            }
        }
        return res;
    }

    /**
     * Find if a cycle exists given the predecessor array
     * @param prev predecessor array
     * @return cycle, as a list, or empty list if there is no cycle
     */
    public static List<Integer> getCycle(int[] prev) {
        int n = prev.length;
        int[] visited = new int[n];
        for (int i = 0; i < n; i++) {
            if (visited[i] < 0) continue;
            int j = i;
            while (prev[j] >= 0 && visited[j] == 0) {
                visited[j] = ~i;
                j = prev[j];
            }
            if (visited[j] != ~i) continue;
            LinkedList<Integer> cycleList = new LinkedList<>();
            int u = j;
            do {
                cycleList.addFirst(u);
                u = prev[u];
            } while (u != j);
            return cycleList;
        }
        return new LinkedList<>();
    }

    /**
     * Print adjacency matrix in an easier to digest form.
     */
    public static void printAdjMatrix(int[][] adjMatrix) {
        assert adjMatrix.length > 0;
        assert adjMatrix.length == adjMatrix[0].length;
        int n = adjMatrix.length;
        for (int[] row : adjMatrix) {
            System.out.printf("%2s", row[0] == INF ? "X" : row[0]);
            for (int i = 1; i < n; i++)
                System.out.printf(",%2s", row[i] == INF ? "X" : row[i]);
            System.out.println(",");
        }
    }

}
