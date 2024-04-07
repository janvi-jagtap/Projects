import cse332.interfaces.BellmanFordSolver;
import cse332.graph.GraphUtil;
import solvers.*;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class BellmanFordTest {

    /** change this line to test other solvers */
    BellmanFordSolver s = new InParallel();

    static final int X = GraphUtil.INF;

    @Test
    public void test_small_graph() {
        int[][] g = {
                {X, 0, 0},
                {X, X, 1},
                {X, -2, X}};
        List<Integer> result = s.solve(g, 0);

        Assertions.assertTrue(cycle_equals(result, List.of(1, 2)));
    }

    @Test
    public void test_small_disconnected_graph() {
        int[][] g = {
                {X, X, X},
                {X, X, 1},
                {X, -2, X}};
        List<Integer> result = s.solve(g, 0);

        Assertions.assertTrue(cycle_equals(result, List.of()));
    }

    @Test
    public void test_small_graph_other_source() {
        int[][] g = {
                {X, X, 1},
                {0, X, 0},
                {-2, X, X}};
        List<Integer> result = s.solve(g, 1);

        Assertions.assertTrue(cycle_equals(result, List.of(0, 2)));
    }

    @Test
    public void test_small_disconnected_graph_other_source() {
        int[][] g = {
                {X, X, 1},
                {X, X, X},
                {-2, X, X}};
        List<Integer> result = s.solve(g, 1);

        Assertions.assertTrue(cycle_equals(result, List.of()));
    }

    @Test
    public void test_medium_graph() {
        int[][] g = {
                {X, 0, 0, 0, 0},
                {X, X, 14, 13, X},
                {X, X, X, X, 1},
                {X, X, -4, X, 11},
                {X, X, -1, -6, X}};
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(cycle_equals(result, List.of(2, 4, 3)));
    }

    @Test
    public void test_simple_cycle_1() {
        int[][] g = {
                {X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, 1},
                {-20, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X}};
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(cycle_equals(result,
                List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19)));
    }

    @Test
    public void test_simple_cycle_2() {
        int[][] g = {
                {X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1, X},
                {X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, -1},
                {-18, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X}};
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(cycle_equals(result,
                List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19)));
    }

    @Test
    public void test_random_graph_5_4cycle() {
        int[][] g = GraphUtil.generate(5, 0.8, 0.5, 2, 4, -4, -2, 332);
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(
                cycle_equals(result, List.of(1, 3)) ||
                        cycle_equals(result, List.of(1, 3, 2, 4)) ||
                        cycle_equals(result, List.of(1, 4, 2, 3)) ||
                        cycle_equals(result, List.of(2, 3)));
    }

    @Test
    public void test_random_graph_10_2cycle() {
        int[][] g = GraphUtil.generate(10, 0.3, 0.3, 4, 12, -4, 0, 332332);
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(
                cycle_equals(result, List.of(2, 9, 8)) ||
                        cycle_equals(result, List.of(2, 9, 8, 7)));
    }

    @Test
    public void test_random_graph_20() {
        int[][] g = GraphUtil.generate(20, 0.15, 0.1, 8, 16, -8, 0, 332);
        List<Integer> result = s.solve(g, 0);
        Assertions.assertTrue(cycle_equals(result, List.of(12, 9, 5)));
    }

    private boolean cycle_equals(List<Integer> expected, List<Integer> actual) {
        if (actual.size() != expected.size())
            return false;
        int n = expected.size();
        if (n == 0)
            return true;
        int offset = expected.indexOf(actual.get(0));
        if (offset == -1)
            return false;
        for (int i = 0; i < expected.size(); i++) {
            if ((int) actual.get(i) != expected.get((i + offset) % n))
                return false;
        }
        return true;
    }

}
