package provided;

import cse332.datastructures.containers.Item;
import cse332.datastructures.trees.BinarySearchTree.BSTNode;
import cse332.interfaces.misc.Dictionary;
import datastructures.dictionaries.AVLTree;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.lang.reflect.Field;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class AVLTreeTests {

	private <E extends Comparable<E>> void incrementValueWithKey(Dictionary<E, Integer> tree, E key) {
		Integer value = tree.find(key);
		if (value == null) {
			tree.insert(key, 1);
		}
		else {
			tree.insert(key, value + 1);
		}
	}

	@SuppressWarnings("rawtypes")
	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_insertFind_severalElements_correctStructure() {
		AVLTree<Integer, Integer> tree = new AVLTree<>();
        // {10, 14, 10, 31, 10, 13, 10, 10, 12, 10, 13, 10, 10, 11, 10, 14, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 14);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 31);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 13);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 12);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 13);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 11);

        // {10, 14, 31, 13, 12, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
		incrementValueWithKey(tree, 10);
		incrementValueWithKey(tree, 14);
		incrementValueWithKey(tree, 9);
		incrementValueWithKey(tree, 8);
		incrementValueWithKey(tree, 7);
		incrementValueWithKey(tree, 6);
		incrementValueWithKey(tree, 5);
		incrementValueWithKey(tree, 4);
		incrementValueWithKey(tree, 3);
		incrementValueWithKey(tree, 2);
		incrementValueWithKey(tree, 1);
		incrementValueWithKey(tree, 0);

		BSTNode root = getField(tree, "root");

		String trueData = " [8 [4 [2 [1 [0..].] [3..]] [6 [5..] [7..]]] [12 [10 [9..] [11..]] [14 [13..] [31..]]]]";
		String trueCounts = " [1 [1 [1 [1 [1..].] [1..]] [1 [1..] [1..]]] [1 [9 [1..] [1..]] [2 [2..] [1..]]]]";

		assertEquals(trueData, nestd(root));
		assertEquals(trueCounts, nestc(root));
	}

	public String nestd(BSTNode root) {
		if(root == null)
			return ".";
		return " [" + root.key + nestd(root.children[0]) + nestd(root.children[1]) + "]";
	}
	public String nestc(BSTNode root) {
		if(root == null)
			return ".";
		return " [" + root.value + nestc(root.children[0]) + nestc(root.children[1]) + "]";
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_insertFind_fewElements_correctStructure() {
		AVLTree<String, Integer> tree =  new AVLTree<>();
		String[] tests_struct = { "a", "b", "c", "d", "e" };
		String[] tests = { "b", "d", "e", "c", "a" };
		for (int i = 0; i < 5; i++) {
			String str = tests[i] + "a";
			incrementValueWithKey(tree, str);
		}

		int i = 0;
		for (Item<String, Integer> item : tree) {
			String str_heap = item.key;
			String str = tests_struct[i] + "a";
			assertEquals(str, str_heap);
			i++;
		}
	}

	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_insertFind_manyElements_correctStructure() {
		AVLTree<String, Integer> tree = new AVLTree<>();
		int n = 1000;

		// Add them
		for (int i = 0; i < 5 * n; i++) {
			int k = (i % n) * 37 % n;
			String str = String.format("%05d", k);
			for (int j = 0; j < k + 1; j ++)
				incrementValueWithKey(tree, str);
		}

		// Calculate count of all values in tree
		int totalCount = 0;
		for (Item<String, Integer> dc : tree) {
			assertEquals((Integer.parseInt(dc.key) + 1) * 5, dc.value.intValue());
			totalCount += dc.value;
		}

		// Check for accuracy
		assertEquals((n * (n + 1)) / 2 * 5, totalCount);
		assertEquals(n, tree.size());
		assertNotNull(tree.find("00851"));
		assertEquals(4260, (int) tree.find("00851"));
	}



	/**
	 * Get a field from an object
	 * @param o Object you want to get the field from
	 * @param fieldName Name of the field
     */
	@SuppressWarnings("unchecked")
	private <T> T getField(Object o, String fieldName) {
		try {
			Field field = o.getClass().getSuperclass().getDeclaredField(fieldName);
			field.setAccessible(true);
			Object f = field.get(o);
			return (T) f;
		} catch (Exception e) {
			try {
				Field field = o.getClass().getDeclaredField(fieldName);
				field.setAccessible(true);
				Object f = field.get(o);
				return (T) f;
			} catch (Exception e2) {
				return null;
			}
		}
	}

}
