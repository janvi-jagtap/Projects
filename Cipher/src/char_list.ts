import { List, nil, cons } from './list';


/** Returns the elements of a list, packed into a string. */
export const compact = (L: List<number>): string => {
  if (L === nil) {
    return "";
  } else {
    if (L.hd < 0 || 65536 <= L.hd) {
      throw new Error(`invalid char code "${L.hd}"`)
    } else {
      return String.fromCharCode(L.hd) + compact(L.tl);  // NOTE: O(n^2)
    }
  }
};


/** Returns the chars of the given string in a char list. */
export const explode = (s: string): List<number> => {
  if (s.length === 0) {
    return nil;
  } else {
    return cons(s.charCodeAt(0), explode(s.substring(1)));  // NOTE: O(n^2)
  }
};
