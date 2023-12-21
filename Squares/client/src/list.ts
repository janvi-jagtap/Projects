export type List<A> =
    | "nil"
    | {readonly kind: "cons", readonly hd: A, readonly tl: List<A>};


/** The empty list. */
export const nil: "nil" = "nil";

/** Returns a list with hd in front of tl. */
export const cons = <A,>(hd: A, tl: List<A>): List<A> => {
  return {kind: "cons", hd: hd, tl: tl};
};


/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
export const len = <A,>(L: List<A>): number => {
  if (L === nil) {
    return 0;
  } else {
    return 1 + len(L.tl);
  }
};

/**
 * Determines whether the two given lists are equal, using === to compare the
 * corresponding values in the lists.
 * @param L The first list to compare
 * @param R The second list to compare
 * @returns true iff the lists have the same length and the elements at the same
 *     indexes of the two lists have values that are ===.
 */
export const equal = <A>(L: List<A>, R: List<A>): boolean => {
  if (L === nil) {
    return R === nil;
  } else if (R === nil) {
    return false;
  } else if (L.hd !== R.hd) {
    return false;
  } else {
    return equal(L.tl, R.tl);
  }
};

/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
export const concat = <A,>(L: List<A>, R: List<A>): List<A> => {
  if (L === nil) {
    return R;
  } else {
    return cons(L.hd, concat(L.tl, R));
  }
};

/**
 * Returns the element at index n in the list.
 * @param n an integer between 0 and len(L) - 1 inclusie
 * @returns L.hd if n is 0 else at(n - 1, L.tl)
 */
export const at = <A,>(n: number, L: List<A>): A => {
  if (L === nil) {
    throw new Error('no element at that index');
  } else if (n === 0) {
    return L.hd;
  } else {
    return at(n - 1, L.tl);
  }
};

/**
 * Returns the reverse of the given list.
 * @param L list to revese
 * @returns list containing the same elements but in reverse order
 */
export const rev = <A>(L: List<A>): List<A> => {
  if (L === nil) {
    return nil;
  } else {
    return concat(rev(L.tl), cons(L.hd, nil));
  }
};

/**
 * Returns the first n elements of the list.
 * @param n number of elements to return
 * @param L list in question
 * @requires n <= len(L) 
 * @returns nil if n = 0 else cons(L.hd, prefix(n - 1, L.tl))
 */
export const prefix = <A,>(n: number, L: List<A>): List<A> => {
  if (n === 0) {
    return nil;
  } else if (L === nil) {
    throw new Error('ran out of elements trying to get a prefix');
  } else {
    return cons(L.hd, prefix(n - 1, L.tl));
  }
};

/**
 * Returns everything after the first n elements of the list.
 * @param n number of elements to skip
 * @param L list in question
 * @requires n <= len(L) 
 * @returns L if n = 0 else suffix(n - 1, L.tl)
 */
export const suffix = <A,>(n: number, L: List<A>): List<A> => {
  if (n === 0) {
    return L;
  } else if (L === nil) {
    throw new Error('ran out of elements trying to get a suffix');
  } else {
    return suffix(n - 1, L.tl);
  }
};

/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
export const compact_list = <A,>(L: List<A>): Array<A> => {
  if (L === nil) {
    return [];
  } else {
    return [L.hd].concat(compact_list(L.tl));  // NOTE: O(n^2)
  }
};

/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
export const explode_array = <A,>(arr: ReadonlyArray<A>): List<A> => {
  if (arr.length === 0) {
    return nil;
  } else {
    return cons(arr[0], explode_array(arr.slice(1)));  // NOTE: O(n^2)
  }
};
