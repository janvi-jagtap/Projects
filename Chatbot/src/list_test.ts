import * as assert from 'assert';
import { nil, cons, len, equal, at, concat, rev,
         compact_list, explode_array } from './list';


describe('list', function() {

  it('len', function() {
    // 0-1-many: base case, 0 recursive calls (only 1 possible input)
    assert.deepStrictEqual(len(nil), 0);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(len(cons(1, nil)), 1);
    assert.deepStrictEqual(len(cons(2, nil)), 1);
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(len(cons(1, cons(2, nil))), 2);
    assert.deepStrictEqual(len(cons(3, cons(2, cons(1, cons(0, nil))))), 4);
  });

  it('equal', function() {
    // 0-1-many: 0 recursive calls - first branch
    assert.deepStrictEqual(equal(nil, nil), true);
    assert.deepStrictEqual(equal(nil, cons(1, nil)), false);
    // 0-1-many: 0 recursive calls - second branch
    assert.deepStrictEqual(equal(cons(1, nil), nil), false);
    assert.deepStrictEqual(equal(cons(1, cons(2, nil)), nil), false);
    // 0-1-many: 0 recursive calls - third branch
    assert.deepStrictEqual(equal(cons(1, nil), cons(2, nil)), false);
    assert.deepStrictEqual(equal(cons(2, nil), cons(1, cons(2, nil))), false);

    // 0-1-many: 1 recursive call - first branch
    assert.deepStrictEqual(equal(cons(3, nil), cons(3, nil)), true);
    assert.deepStrictEqual(equal(cons(3, nil), cons(3, cons(1, nil))), false);
    // 0-1-many: 1 recursive call - second branch
    assert.deepStrictEqual(equal(cons(4, cons(1, nil)), cons(4, nil)), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(1, cons(2, nil))), cons(4, nil)), false);
    // 0-1-many: 1 recursive call - third branch
    assert.deepStrictEqual(
        equal(cons(5, cons(1, nil)), cons(5, cons(2, nil))), false);
    assert.deepStrictEqual(
        equal(cons(5, cons(2, nil)), cons(5, cons(1, cons(2, nil)))), false);

    // 0-1-many: 2 recursive calls - first branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, nil)), cons(4, cons(3, nil))), true);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, nil)), cons(4, cons(3, cons(1, nil)))), false);
    // 0-1-many: 2 recursive calls - second branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, nil))), cons(4, cons(3, nil))), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, cons(2, nil)))), cons(4, cons(3, nil))), false);
    // 0-1-many: 2 recursive calls - third branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, nil))), cons(4, cons(3, cons(2, nil)))), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(2, nil))), cons(4, cons(3, cons(1, cons(2, nil))))), false);
  });

  it('at', function() {
    const L0 = nil;
    const L1 = cons(5, nil);
    const L2 = cons(4, cons(5, nil));
    const L3 = cons(1, cons(2, cons(3, nil)));
    const L4 = cons(9, cons(8, cons(7, cons(6, nil))));

    // 0-1-many: 0 recursive calls, top branch
    assert.throws(() => at(-1, L0));
    assert.throws(() => at(0, L0));
    assert.throws(() => at(-1, L1));
    assert.throws(() => at(1, L1));

    // 0-1-many: 0 recursive calls, middle branch
    assert.deepStrictEqual(at(0, L1), 5);
    assert.deepStrictEqual(at(0, L2), 4);
    assert.deepStrictEqual(at(0, L3), 1);

    // 0-1-many: 1 recursive call, top branch
    assert.throws(() => at(1, L0));
    assert.throws(() => at(1, cons(7, nil)));

    // 0-1-many: 1 recursive call, middle branch
    assert.deepStrictEqual(at(1, L2), 5);
    assert.deepStrictEqual(at(1, L3), 2);

    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(at(2, L3), 3);
    assert.deepStrictEqual(at(2, L4), 7);
    assert.deepStrictEqual(at(3, L4), 6);
    assert.throws(() => at(3, L3));
    assert.throws(() => at(4, L4));
  });

  it('concat', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepStrictEqual(concat(nil, nil), nil);
    assert.deepStrictEqual(concat(nil, cons(1, nil)), cons(1, nil));
    assert.deepStrictEqual(concat(nil, cons(1, cons(2, nil))), cons(1, cons(2, nil)));
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(concat(cons(1, nil), nil), cons(1, nil));
    assert.deepStrictEqual(concat(cons(1, nil), cons(2, nil)), cons(1, cons(2, nil)));
    assert.deepStrictEqual(concat(cons(1, nil), cons(2, cons(3, nil))),
        cons(1, cons(2, cons(3, nil))));
    // 0-1-many: 2+ recursive call
    assert.deepStrictEqual(concat(cons(1, cons(2, nil)), nil), cons(1, cons(2, nil)));
    assert.deepStrictEqual(concat(cons(1, cons(2, nil)), cons(3, nil)),
        cons(1, cons(2, cons(3, nil))));
    assert.deepStrictEqual(concat(cons(1, cons(2, nil)), cons(3, cons(4, nil))),
        cons(1, cons(2, cons(3, cons(4, nil)))));
  });

  it('rev', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(rev(nil), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(rev(cons(1, nil)), cons(1, nil));
    assert.deepStrictEqual(rev(cons(2, nil)), cons(2, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(rev(cons(1, cons(2, nil))), cons(2, cons(1, nil)));
    assert.deepStrictEqual(rev(cons(1, cons(2, cons(3, nil)))),
        cons(3, cons(2, cons(1, nil))));
  });

  it('compact_list', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(compact_list(nil), []);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(compact_list(cons(1, nil)), [1]);
    assert.deepStrictEqual(compact_list(cons(8, nil)), [8]);
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(compact_list(cons(1, cons(2, nil))), [1, 2]);
    assert.deepStrictEqual(compact_list(cons(3, cons(2, cons(1, nil)))), [3, 2, 1]);
  });

  it('explode_array', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(explode_array([]), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(explode_array([1]), cons(1, nil));
    assert.deepStrictEqual(explode_array([8]), cons(8, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(explode_array([1, 2]), cons(1, cons(2, nil)));
    assert.deepStrictEqual(explode_array([1, 2, 3]), cons(1, cons(2, cons(3, nil))));
  });

});
