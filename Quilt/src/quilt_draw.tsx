import React from 'react';
import { RED, ROUND, NW, NE, SW, SE, Square, Row, rnil, Quilt, qnil, rlen } from './quilt';
import { JsxList, jnil, jcons, jcompact } from './jsx_list';
import StraightRed from './img/straight-red.png';
import StraightGreen from './img/straight-green.png';
import RoundRed from './img/round-red.png';
import RoundGreen from './img/round-green.png';
import './quilt_draw.css';


// Returns the class name to put on the image element for the given square.
const SquareClass = (square: Square): string => {
  switch (square.corner) {
    case NW: return "square rotate-nw";
    case SW: return "square rotate-sw";
    case SE: return "square rotate-se";
    case NE: return "square rotate-ne";
  }
};

/** Returns an element that draws the given square. */
export const SquareElem = (props: {square: Square}): JSX.Element => {
  const cls = SquareClass(props.square)
  if (props.square.color === RED ) {
    if (props.square.shape === ROUND) {
      return <img src={RoundRed} className={cls}/>
    } else {
      return <img src={StraightRed} className={cls}/>
    }
  } else {
    if (props.square.shape === ROUND) {
      return <img src={RoundGreen} className={cls}/>
    } else {
      return <img src={StraightGreen} className={cls}/>
    }
  }
};

// Returns a list of square elements for each square in the given row.
const getSquareElems = (row: Row, key: number): JsxList => {
  if (row === rnil) {
    return jnil;
  } else {
    return jcons(<SquareElem key={key} square={row.hd}/>,
        getSquareElems(row.tl, key + 1));
  }
};

// Returns a list of DIV elements, one for each row in the given quilt.
// Throws an exception if any row has a different length than expected.
const getRowElems = (quilt: Quilt, expLen: number, key: number): JsxList => {
  if (quilt === qnil) {
    return jnil;
  } else {
    const rowLen = rlen(quilt.hd);
    if (rowLen !== expLen) {
      throw new Error(
          `bad quilt argument: rows have different lengths: ${rowLen} vs ${expLen}`);
    } else {
      const row = jcompact(getSquareElems(quilt.hd, 0));
      return jcons(<div key={key} className="row">{row}</div>,
          getRowElems(quilt.tl, expLen, key + 1));
    }
  }
};


/** Returns an element that draws the given quilt. */
export const QuiltElem = (props: {quilt: Quilt}): JSX.Element => {
  if (props.quilt === qnil) {
    throw new Error("bad quilt argument: cannot have 0 rows");
  } else {
    const exp_len = rlen(props.quilt.hd);
    const rows = jcompact(getRowElems(props.quilt, exp_len, 0));
    return <div>{rows}</div>;
  }
};
