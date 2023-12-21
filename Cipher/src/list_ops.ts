import { List, nil, cons } from './list';


/** Returns the last element in the given list. */
export const last = <A,>(L: List<A>): A => {
    if (L === nil) {
        throw new Error("empty list has no last element");
    } else if (L.tl === nil) {
        return L.hd;
    } else {
        return last(L.tl);
    }
};


/** Returns the prefix consting of the first n elements of L. */
export const prefix = <A,>(n: number, L: List<A>): List<A> => {
  if (n === 0) {
    return nil;
  }
  else if (L === nil) {
    throw new Error("The number has to be at most as long as the list");
  }
  else {
    return cons(L.hd, prefix(n-1, L.tl));
  }
};


/** Returns the suffix consting of the elements of L after the first n. */
export const suffix = <A,>(n: number, L: List<A>): List<A> => {
  if (n === 0) {
    return L;
  }
  else if (L === nil) {
    throw new Error("The number has to be at most as long as the list");
  }
  else {
    return suffix(n -1, L.tl);
  }
};
