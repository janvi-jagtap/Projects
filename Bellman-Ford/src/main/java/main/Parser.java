package main;

import cse332.exceptions.NotYetImplementedException;
import cse332.graph.GraphUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Parser {

    /**
     * Parse an adjacency matrix into an adjacency list.
     * @param adjMatrix Adjacency matrix
     * @return Adjacency list of maps from node to weight
     */
    public static List<Map<Integer, Integer>> parse(int[][] adjMatrix) {

        List<Map<Integer, Integer>> listOfMaps = new ArrayList<>();

        for (int i = 0; i < adjMatrix.length; i++) {
            Map<Integer, Integer> map = new HashMap<>();
            for (int j = 0; j < adjMatrix[i].length; j++) {
                if (adjMatrix[i][j] != GraphUtil.INF) {
                    map.put(j, adjMatrix[i][j]);
                }
            }
            listOfMaps.add(map);
        }
        return listOfMaps;

    }

    /**
     * Parse an adjacency matrix into an adjacency list with incoming edges instead of outgoing edges.
     * @param adjMatrix Adjacency matrix
     * @return Adjacency list of maps from node to weight with incoming edges
     */
    public static List<Map<Integer, Integer>> parseInverse(int[][] adjMatrix) {
        List<Map<Integer, Integer>> listOfMaps = new ArrayList<>();

        for (int i = 0; i < adjMatrix[0].length; i++) {
            Map<Integer, Integer> map = new HashMap<>();
            for (int j = 0; j < adjMatrix.length; j++) {
                if (adjMatrix[j][i] != GraphUtil.INF) {
                    map.put(j, adjMatrix[j][i]);
                }
            }
            listOfMaps.add(map);
        }
        return listOfMaps;
    }
}
