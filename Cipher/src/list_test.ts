import * as assert from 'assert';
import { nil, cons, len, concat, rev } from './list';


describe('list', function() {

  it('len', function() {
    // 0-1-many: base case, 0 recursive calls (only 1 possible input)
    assert.deepEqual(len(nil), 0);

    // 0-1-many: 1 recursive call
    assert.deepEqual(len(cons(1, nil)), 1);
    assert.deepEqual(len(cons(2, nil)), 1);

    // 0-1-many: 2+ recursive calls
    assert.deepEqual(len(cons(1, cons(2, nil))), 2);
    assert.deepEqual(len(cons(3, cons(2, cons(1, cons(0, nil))))), 4);
  });

  it('concat', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepEqual(concat(nil, nil), nil);
    assert.deepEqual(concat(nil, cons(1, nil)), cons(1, nil));
    assert.deepEqual(concat(nil, cons(1, cons(2, nil))), cons(1, cons(2, nil)));

    // 0-1-many: 1 recursive call
    assert.deepEqual(concat(cons(1, nil), nil), cons(1, nil));
    assert.deepEqual(concat(cons(1, nil), cons(2, nil)), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, nil), cons(2, cons(3, nil))),
        cons(1, cons(2, cons(3, nil))));

    // 0-1-many: 2+ recursive call
    assert.deepEqual(concat(cons(1, cons(2, nil)), nil), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, nil)),
        cons(1, cons(2, cons(3, nil))));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, cons(4, nil))),
        cons(1, cons(2, cons(3, cons(4, nil)))));
  });

  it('rev', function() {
    // 0-1-many: base case, 0 recursive calls (only 1 possible input)
    assert.deepEqual(rev(nil), nil);

    // 0-1-many: 1 recursive call
    assert.deepEqual(rev(cons(1, nil)), cons(1, nil));
    assert.deepEqual(rev(cons(2, nil)), cons(2, nil));

    // 0-1-many: 2+ recursive calls
    assert.deepEqual(rev(cons(1, cons(2, nil))), cons(2, cons(1, nil)));
    assert.deepEqual(rev(cons(1, cons(2, cons(3, nil)))),
        cons(3, cons(2, cons(1, nil))));
  });
});
