import { Quilt, Square, Row, qcons, rcons, Color, qnil} from './quilt';


/** Returns a quilt in pattern "A". */
export const PatternA = (row: number, color?: Color ): Quilt => {
  if (row < 0) {
    throw new Error("Make sure the number is positive");
  }
  else if (row === 0) {
    return qnil;
  }
  else {
      if (color === undefined) {
        const square1: Square = {shape: "ROUND", color: "GREEN", corner: "NW"};
        const r: Row = rcons(square1, rcons(square1, "rnil"));
        return qcons(r, PatternA(row - 1, "GREEN"));
      }
      else {
        const square1: Square = {shape: "ROUND", color: color, corner: "NW"};
        const r: Row = rcons(square1, rcons(square1, "rnil"));
        return qcons(r, PatternA(row - 1, color));
      }
  } 
}

/** Returns a quilt in pattern "B". */
export const PatternB = (row: number, color?: Color): Quilt => {
  if (row < 0) {
    throw new Error("Make sure the number is positive");
  }
  else if (row === 0) {
    return qnil;
  }
  else {
    if (color == undefined) {
      const square1: Square = {shape: "STRAIGHT", color: "GREEN", corner: "SE"};
      const square2: Square = {shape: "STRAIGHT", color: "GREEN", corner: "NW"};
      const r: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(r, PatternB(row - 1, color));
    }
    else {
      const square1: Square = {shape: "STRAIGHT", color: color, corner: "SE"};
      const square2: Square = {shape: "STRAIGHT", color: color, corner: "NW"};
      const r: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(r, PatternB(row - 1, color));
    }
  }
}

/** Returns a quilt in pattern "C". */
export const PatternC = (row: number, color?: Color): Quilt => {
  if (row % 2 !== 0 || row < 0) {
    throw new Error("Make sure the number is even and positive");
  }
  else if (row === 0){
    return qnil;
  }
  else {
    if (color === undefined) {
      const square1: Square = {shape: "ROUND", color: "GREEN", corner: "NE"};
      const square2: Square = {shape: "ROUND", color: "GREEN", corner: "NW"};
      const square3: Square = {shape: "ROUND", color: "GREEN", corner: "SE"};
      const square4: Square = {shape: "ROUND", color: "GREEN", corner: "SW"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      const row2: Row = rcons(square3, rcons(square4, "rnil"));
      return qcons(row1, qcons(row2, PatternC(row - 2, color)));      
    }
    else {
      const square1: Square = {shape: "ROUND", color: color, corner: "NE"};
      const square2: Square = {shape: "ROUND", color: color, corner: "NW"};
      const square3: Square = {shape: "ROUND", color: color, corner: "SE"};
      const square4: Square = {shape: "ROUND", color: color, corner: "SW"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      const row2: Row = rcons(square3, rcons(square4, "rnil"));
      return qcons(row1, qcons(row2, PatternC(row - 2, color)));          
    }
  }
}

/** Returns a quilt in pattern "D". */
export const PatternD = (row: number, color?: Color): Quilt => {
  if (row % 2 != 0 || row < 0) {
    throw new Error("Make sure number is even and positive");
  }
  else if (row === 0) {
    return qnil;
  }
  else {
    if (color === undefined) {
      const square1: Square = {shape: "ROUND", color: "GREEN", corner: "NE"};
      const square2: Square = {shape: "ROUND", color: "GREEN", corner: "NW"};
      const square3: Square = {shape: "ROUND", color: "GREEN", corner: "SE"};
      const square4: Square = {shape: "ROUND", color: "GREEN", corner: "SW"};
      const row1: Row = rcons(square3, rcons(square4, "rnil"));
      const row2: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(row1, qcons(row2, PatternD(row - 2, color)));      
    }
    else {
      const square1: Square = {shape: "ROUND", color: color, corner: "NE"};
      const square2: Square = {shape: "ROUND", color: color, corner: "NW"};
      const square3: Square = {shape: "ROUND", color: color, corner: "SE"};
      const square4: Square = {shape: "ROUND", color: color, corner: "SW"};
      const row1: Row = rcons(square3, rcons(square4, "rnil"));
      const row2: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(row1, qcons(row2, PatternD(row - 2, color)));           
    }
  }
}

/** Returns a quilt in pattern "E". */
export const PatternE = (rows: number, color?: Color): Quilt => {
  if (rows < 0) {
    throw new Error("Make sure the number is positive");
  }
  else if (rows === 0) {
    return qnil;
  }
  else if (rows === 1) {
    if (color === undefined) {
      const square1: Square = {shape: "STRAIGHT", color: "GREEN", corner: "NW"};
      const square2: Square = {shape: "STRAIGHT", color: "GREEN", corner: "SE"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(row1, "qnil");
    }
    else {
      const square1: Square = {shape: "STRAIGHT", color: color, corner: "NW"};
      const square2: Square = {shape: "STRAIGHT", color: color, corner: "SE"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      return qcons(row1, "qnil");      
    }
  }
  else {
    if (color === undefined) {
      const square1: Square = {shape: "STRAIGHT", color: "GREEN", corner: "NW"};
      const square2: Square = {shape: "STRAIGHT", color: "GREEN", corner: "SE"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      const row2: Row = rcons(square2, rcons(square1, "rnil")); 
      return qcons(row1, qcons(row2, PatternE(rows - 2, color)));    
    }
    else {
      const square1: Square = {shape: "STRAIGHT", color: color, corner: "NW"};
      const square2: Square = {shape: "STRAIGHT", color: color, corner: "SE"};
      const row1: Row = rcons(square1, rcons(square2, "rnil"));
      const row2: Row = rcons(square2, rcons(square1, "rnil")); 
      return qcons(row1, qcons(row2, PatternE(rows - 2, color)));  
    }
  }
}
