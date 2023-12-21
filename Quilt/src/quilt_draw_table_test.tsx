
import * as assert from 'assert';
import React from 'react';
import { NW, NE, SW, SE, GREEN, RED, STRAIGHT, ROUND, Square,
         rnil, rcons, qnil, qcons } from './quilt';
import { jnil, jcons } from './jsx_list';
import { SquareTableElem, RowTableElems, RowTableElem,
         QuiltTableElems, QuiltTableElem } from './quilt_draw_table';


describe('quilt_draw_table', function() {
  // Note: When we run code in the browser that includes these elements
  // as HTML literals (e.g. <SquareTableElem>), React actually calls
  // calls the functions for these elements and replaces those tags 
  // with their return values. In tests the functions are not automatically
  // invoked, so we do this explicitly (e.g. SquareTableElem({...}))

  it('SquareTableElem', function() {
    // branch for color = green
    const sq1: Square = {corner: NE, color: GREEN, shape: ROUND};
    assert.deepStrictEqual(SquareTableElem({square: sq1, key: 0}),
        (<td key={0} className={"sq-green"}>NE</td>));
    assert.deepStrictEqual(SquareTableElem({square: sq1, key: 5}),
        (<td key={5} className={"sq-green"}>NE</td>));

    // branch for color = red
    const sq2: Square = {corner: NW, color: RED, shape: STRAIGHT};
    assert.deepStrictEqual(SquareTableElem({square: sq2, key: 1}),
        (<td key={1} className={"sq-red"}>NW</td>));
    assert.deepStrictEqual(SquareTableElem({square: sq2, key: 4}),
        (<td key={4} className={"sq-red"}>NW</td>));
  });

  const nw_sq: Square = {corner: NW, color: GREEN, shape: ROUND};
  const ne_sq: Square = {corner: NE, color: GREEN, shape: ROUND};
  const sw_sq: Square = {corner: SW, color: GREEN, shape: ROUND};
  const se_sq: Square = {corner: SE, color: GREEN, shape: ROUND};

  it('RowTableElems', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(RowTableElems({row: rnil, key: 0}), jnil);

    // 0-1-many: recursive case once
    const r1 = rcons(nw_sq, rnil);
    assert.deepStrictEqual(RowTableElems({row: r1, key: 0}),
        jcons(<td key={0} className={"sq-green"}>NW</td>, jnil));
    const r12 = rcons(sw_sq, rnil);
    assert.deepStrictEqual(RowTableElems({row: r12, key: 3}),
        jcons(<td key={3} className={"sq-green"}>SW</td>, jnil));

    // 0-1-many: recursive case multiple times
    const r2 = rcons(nw_sq, rcons(ne_sq, rnil));
    assert.deepStrictEqual(RowTableElems({row: r2, key: 1}),
        jcons(<td key={1} className={"sq-green"}>NW</td>,
            jcons(<td key={2} className={"sq-green"}>NE</td>, jnil)));
    const r22 = rcons(nw_sq, rcons(sw_sq, rnil));
    assert.deepStrictEqual(RowTableElems({row: r22, key: 2}),
        jcons(<td key={2} className={"sq-green"}>NW</td>,
            jcons(<td key={3} className={"sq-green"}>SW</td>, jnil)));
  });

  it('RowTableElem', function() {
    // Straight line code, 2 tests
    assert.deepStrictEqual(RowTableElem({row: rcons(nw_sq, rnil), key: 0}),
        <tr key={0}>{[
            <td key={0} className={"sq-green"}>NW</td>,
        ]}</tr>);
    assert.deepStrictEqual(RowTableElem({row: rcons(ne_sq, rnil), key: 0}),
        <tr key={0}>{[
            <td key={0} className={"sq-green"}>NE</td>,
        ]}</tr>);

    // Note: the expected output for these tests is in the form:
    //     <TR> {[ <TD>NW</TD>, <TD>NE</TD> ]} </TR>
    // rather than: <TR><TD>NW</TD><TD>NE</TD></TR>.  When it displays 
    // the HTML, React transforms the former form to the latter.
    // The latter is some syntactic sugar for creating a tree.
  });

  it('QuiltTableElems', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(QuiltTableElems({quilt: qnil, key: 0}), jnil);

    // 0-1-many: recursive case once
    const q1 = qcons(rcons(nw_sq, rnil), qnil);
    assert.deepStrictEqual(QuiltTableElems({quilt: q1, key: 0}),
        jcons(<tr key={0}>{[<td key={0} className={"sq-green"}>NW</td>]}</tr>, jnil));
    const q12 = qcons(rcons(sw_sq, rnil), qnil);
    assert.deepStrictEqual(QuiltTableElems({quilt: q12, key: 5}),
        jcons(<tr key={5}>{[<td key={0} className={"sq-green"}>SW</td>]}</tr>, jnil));

    // 0-1-many: recursive case multiple times
    const q2 = qcons(rcons(nw_sq, rnil), qcons(rcons(sw_sq, rnil), qnil));
    assert.deepStrictEqual(QuiltTableElems({quilt: q2, key: 1}),
        jcons(<tr key={1}>{[<td key={0} className={"sq-green"}>NW</td>]}</tr>,
          jcons(<tr key={2}>{[<td key={0} className={"sq-green"}>SW</td>]}</tr>, jnil)));
    const q22 = qcons(rcons(sw_sq, rnil), qcons(rcons(ne_sq, rnil), qnil));
    assert.deepStrictEqual(QuiltTableElems({quilt: q22, key: 3}),
        jcons(<tr key={3}>{[<td key={0} className={"sq-green"}>SW</td>]}</tr>,
          jcons(<tr key={4}>{[<td key={0} className={"sq-green"}>NE</td>]}</tr>, jnil)));
  });

  it('QuiltTableElem', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(QuiltTableElem({quilt: qnil}),
        <table><tbody>{[]}</tbody></table>);

    // 0-1-many: recursive case once
    const q1 = qcons(rcons(nw_sq, rnil), qnil);
    assert.deepStrictEqual(QuiltTableElem({quilt: q1}),
        <table><tbody>{[
            <tr key={0}>{[
                <td key={0} className={"sq-green"}>NW</td>,
            ]}</tr>
        ]}</tbody></table>);
    const q12 = qcons(rcons(se_sq, rnil), qnil);
    assert.deepStrictEqual(QuiltTableElem({quilt: q12}),
        <table><tbody>{[
            <tr key={0}>{[
                <td key={0} className={"sq-green"}>SE</td>,
            ]}</tr>
        ]}</tbody></table>);

    // 0-1-many: recursive case multiple times
    const q2 = qcons(rcons(nw_sq, rnil), qcons(rcons(sw_sq, rnil), qnil));
    assert.deepStrictEqual(QuiltTableElem({quilt: q2}),
        <table><tbody>{[
            <tr key={0}>{[
                <td key={0} className={"sq-green"}>NW</td>,
            ]}</tr>,
            <tr key={1}>{[
                <td key={0} className={"sq-green"}>SW</td>,
            ]}</tr>
        ]}</tbody></table>);
    const q22 = qcons(rcons(se_sq, rnil), qcons(rcons(ne_sq, rnil), qnil));
    assert.deepStrictEqual(QuiltTableElem({quilt: q22}),
        <table><tbody>{[
            <tr key={0}>{[
                <td key={0} className={"sq-green"}>SE</td>,
            ]}</tr>,
            <tr key={1}>{[
                <td key={0} className={"sq-green"}>NE</td>,
            ]}</tr>
        ]}</tbody></table>);
  });

});
