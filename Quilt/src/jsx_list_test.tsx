
import * as assert from 'assert';
import React from 'react';
import { jnil, jcons, jcompact, jexplode } from './jsx_list';


describe('jsx_list', function() {

  const elem1: JSX.Element = React.createElement("P", {}, "hi");
  const elem2: JSX.Element = React.createElement("SPAN", {}, "there");

  it('jcompact', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(jcompact(jnil), []);

    // 0-1-many: recursive case once
    assert.deepStrictEqual(jcompact(jcons(elem1, jnil)), [elem1]);
    assert.deepStrictEqual(jcompact(jcons(elem2, jnil)), [elem2]);

    // 0-1-many: recursive case multiple times
    assert.deepStrictEqual(jcompact(jcons(elem1, jcons(elem2, jnil))), [elem1, elem2]);
    assert.deepStrictEqual(jcompact(jcons(elem2, jcons(elem1, jnil))), [elem2, elem1]);
  });

  it('jexplode', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(jexplode([]), jnil);

    // 0-1-many: recursive case once
    assert.deepStrictEqual(jexplode([elem1]), jcons(elem1, jnil));
    assert.deepStrictEqual(jexplode([elem2]), jcons(elem2, jnil));

    // 0-1-many: recursive case multiple times
    assert.deepStrictEqual(jexplode([elem1, elem2]), jcons(elem1, jcons(elem2, jnil)));
    assert.deepStrictEqual(jexplode([elem2, elem1]), jcons(elem2, jcons(elem1, jnil)));
  });

});