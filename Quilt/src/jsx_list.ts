export type JsxList = "jnil" | {kind: "jcons", hd: JSX.Element, tl: JsxList};

/** An empty list of elements. */
export const jnil: "jnil" = "jnil";

/**
 * Returns a list that has hd followed by tl.
 * @param hd element to be the head of the returned list
 * @param tl elements to be the rest of the returned list
 * @returns a list that has hd followed by tl
 */
export const jcons = (hd: JSX.Element, tl: JsxList): JsxList => {
  return {kind: "jcons", hd: hd, tl: tl};
};


/** Returns the elements of a list, packed into an array. */
export const jcompact = (L: JsxList): JSX.Element[] => {
  if (L === jnil) {
    return [];
  } else {
    return [L.hd].concat(jcompact(L.tl));  // NOTE: O(n^2)
  }
};

/** Returns the elements in the given array as a list. */
export const jexplode = (A: JSX.Element[]): JsxList => {
  if (A.length === 0) {
    return jnil;
  } else {
    return jcons(A[0], jexplode(A.slice(1)));  // NOTE: O(n^2)
  }
};