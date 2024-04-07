package provided;

import cse332.datastructures.containers.Item;
import cse332.datastructures.trees.BinarySearchTree;
import cse332.interfaces.misc.Dictionary;
import datastructures.dictionaries.ChainingHashTable;
import datastructures.dictionaries.MoveToFrontList;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ChainingHashTableTests {

	private void incrementValueWithKey(ChainingHashTable<String, Integer> list, String key) {
		Integer find = list.find(key);
		if (find == null) {
			list.insert(key, 1);
		}
		else {
			list.insert(key, find + 1);
		}
	}


	@Test()
    @Timeout(value = 3000, unit = TimeUnit.MILLISECONDS)
	public void test_insertFind_manyElements_correctStructure() {
		/*
			Replace BinarySearchTree with your own Dictionary implementations like MoveToFrontList or AVLTree
			to test them as chains for the ChainingHashTable (highly recommended to find potential bugs)
		* */
		ChainingHashTable<String, Integer> list = new ChainingHashTable<>(BinarySearchTree::new);
		int n = 1000;

		// Add them
		for (int i = 0; i < 5 * n; i++) {
			int k = (i % n) * 37 % n;
			String str = String.format("%05d", k);
			for (int j = 0; j < k + 1; j ++)
				incrementValueWithKey(list, str);
		}

		// Delete them all
		int totalCount = 0;
		for (Item<String, Integer> dc : list) {
			assertEquals((Integer.parseInt(dc.key) + 1) * 5, (int) dc.value);
			totalCount += dc.value;
		}
		assertEquals(totalCount, (n * (n + 1)) / 2 * 5);
		assertEquals(list.size(), n);
		assertNotNull(list.find("00851"));
		assertEquals(4260, (int) list.find("00851"));
	}
}
