import { List, nil } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** Converts a string to a color (or throws an exception if not a color). */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** Returns a solid square of the given color. */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** Returns a square that splits into the four given parts. */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};


export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;

/** Finds the node given the path and the square which to find it from 
 * @param sq The square which is the starting point to find the other square
 * @param p The list of directions on how to find the other square
 * @returns undefined if the no directions are given and sq is a split square
 *          or if the last square it ended on after directions is a split square
 * @returns The square found from p's directions starting at sq
*/
export const findNode = (sq: Square, p: Path): Square|undefined => {
  if (sq.kind === "solid") {
    return sq;
  }
  else if (p === nil) {
    return undefined;
  }
  else {
    if (p.hd === "NE") {
      return findNode(sq.ne, p.tl);
    }
    else if (p.hd === "NW") {
      return findNode(sq.nw, p.tl);
    }
    else if (p.hd === "SE") {
      return findNode(sq.se, p.tl);
    }
    else {
      return findNode(sq.sw, p.tl);
    }
  }
}

/** Replaces a given square in the position indicated by the given path in an original square 
 * @param sq The original square that will get the replacement
 * @param p The path on how to find where the replacement will occur from the root
 * @param r The replacement square
 * @throws Error if the path given is longer than the square given
 * @returns The original square with it's replacement
*/

export const replace = (sq: Square, p: Path, r: Square): Square => {
  if (p === nil) {
    return r;
  }
  else if (sq.kind === "solid") {
    throw new Error("The path given doesn't match up with this square");
  }
  else {
    if (p.hd === "NE") {
      return split(sq.nw, replace(sq.ne, p.tl, r), sq.sw, sq.se);
    }
    else if (p.hd === "NW") {
      return split(replace(sq.nw, p.tl, r), sq.ne, sq.sw, sq.se);
    }
    else if (p.hd === "SE") {
      return split(sq.nw, sq.ne, sq.sw, replace(sq.se, p.tl, r));
    }
    else {
      return split(sq.nw, sq.ne, replace(sq.sw, p.tl, r), sq.se);
    }
  }
}

/** Rotates the design of the selected split square counter clockwise
 * @param sq The split square that's being rotated
 * @throws Error if the passed in square isn't a split square
 * @returns The rotated square
 */
export const rotateSquare = (sq: Square): Square => {
  if (sq.kind === "solid") {
    throw new Error("A square can only be rotated if it's split into 4 parts");
  }
  else {
    const nw:Square = sq.nw;
    const ne:Square = sq.ne;
    const se:Square = sq.se;
    const sw:Square = sq.sw;
    
    const rotatedSquare: Square = split(ne, se, nw, sw);
    return rotatedSquare;
  }
}


/** Returns JSON describing the given Square. */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** Converts a JSON description to the Square it describes. */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }

}
