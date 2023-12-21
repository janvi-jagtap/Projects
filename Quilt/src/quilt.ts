export type Shape = "STRAIGHT" | "ROUND";

/** Represents a pattern with straight lines. */
export const STRAIGHT: "STRAIGHT" = "STRAIGHT";

/** Represents a pattern with rounded curves. */
export const ROUND: "ROUND" = "ROUND";


export type Color = "GREEN" | "RED";

/** Represents the color green. */
export const GREEN: "GREEN" = "GREEN";

/** Represents the color red. */
export const RED: "RED" = "RED";


export type Corner = "NW" | "NE" | "SW" | "SE";

/** Pattern oriented toward the NW corner. */
export const NW: "NW" = "NW";

/** Pattern oriented toward the NE corner. */
export const NE: "NE" = "NE";

/** Pattern oriented toward the SW corner. */
export const SW: "SW" = "SW";

/** Pattern oriented toward the SE corner. */
export const SE: "SE" = "SE";


export type Square = {
  shape: Shape,
  color: Color,
  corner: Corner
};


export type Row = "rnil" | {kind: "rcons", hd: Square, tl: Row};

/** The empty list of squares. */
export const rnil: "rnil" = "rnil";

/** Returns a list of squares with hd in front of tl. */
export const rcons = (hd: Square, tl: Row): Row => {
  return {kind: "rcons", hd: hd, tl: tl};
};


export type Quilt= "qnil" | {kind: "qcons", hd: Row, tl: Quilt};

/** The empty list of rows. */
export const qnil: "qnil" = "qnil";

/** Returns a list of rows with hd in front of tl. */
export const qcons= (hd: Row, tl: Quilt): Quilt => {
  return {kind: "qcons", hd: hd, tl: tl};
};


/** Returns the length of the given row. */
export const rlen = (row: Row): number => {
  if (row === rnil) {
    return 0;
  } else {
    return 1 + rlen(row.tl);
  }
};

/** Returns the concatenation of two rows. */
export const rconcat = (row1: Row, row2: Row): Row =>{
  if (row1 === rnil) {
    return row2;
  } else {
    return rcons(row1.hd, rconcat(row1.tl, row2));
  }
};

/** Returns the length of the given quilt. */
export const qlen = (quilt: Quilt): number => {
  if (quilt === qnil) {
    return 0;
  } else {
    return 1 + qlen(quilt.tl);
  }
};

/** Returns the concatenation of two quilts. */
export const qconcat = (quilt1: Quilt, quilt2: Quilt): Quilt => {
  if (quilt1 === qnil) {
    return quilt2;
  } else {
    return qcons(quilt1.hd, qconcat(quilt1.tl, quilt2));
  }
};