import * as assert from 'assert';
import { nil, cons, len, split, compact_list, explode_array, split_at } from './list';
import { explode } from './char_list';


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

  it('split', function() {
    // 0-1-many: base case
    assert.deepEqual(split(0, explode("")), [nil, nil]);
    assert.deepEqual(split(0, explode("a")), [nil, explode("a")]);

    // 0-1-many: 1 recursive call
    assert.deepEqual(split(1, explode("a")), [explode("a"), nil]);
    assert.deepEqual(split(1, explode("as")), [explode("a"), explode("s")]);
    assert.deepEqual(split(1, explode("stray")), [explode("s"), explode("tray")]);

    // 0-1-many: 2+ recursive calls (lots for fun)
    assert.deepEqual(split(2, explode("as")), [explode("as"), nil]);
    assert.deepEqual(split(2, explode("stray")), [explode("st"), explode("ray")]);
    assert.deepEqual(split(3, explode("stray")), [explode("str"), explode("ay")]);
    assert.deepEqual(split(4, explode("stray")), [explode("stra"), explode("y")]);
    assert.deepEqual(split(5, explode("stray")), [explode("stray"), explode("")]);
  });
  
  it('split_at', function() {
    //Two inputs to check one of the base cases where a nil list is passed
    //The 0 in the 0-1-many heuristic
    assert.deepStrictEqual(split_at(nil, 2), [nil, nil]);
    assert.deepStrictEqual(split_at(nil, 5), [nil, nil]);
    
    //Two inputs to check the second base case 
    //Where the element to split at is the first element in the list
    //The 0 in the 0-1-many heuristic
    assert.deepStrictEqual(split_at(cons(2, nil), 2), [nil, cons(2, nil)]);
    assert.deepStrictEqual(split_at(cons(5, nil), 5), [nil, cons(5, nil)]);

    //Two inputs to check for when one recursive call is made
    //Where the element to split at is the second element in the list
    //The 1 in the 0-1-many heuristic
    assert.deepStrictEqual(split_at(cons(2, cons(5, nil)), 5), [cons(2, nil), cons(5, nil)]);
    assert.deepStrictEqual(split_at(cons(14, cons(32, nil)), 32), [cons(14, nil), cons(32, nil)]);

    //Two inputs to check for when two recrusive calls are made 
    //Where the element to split at is at any position in the list except first and second
    //The many in the 0-1-many heuristic
    assert.deepStrictEqual(split_at(cons(2, cons(5, cons(7, nil))), 7), [cons(2, cons(5, nil)), cons(7, nil)]);
    assert.deepStrictEqual(split_at(cons(14, cons(32, cons(89, nil))), 89), [cons(14, cons(32, nil)), cons(89, nil)]);
  });

  it('compact_list', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepEqual(compact_list(nil), []);

    // 0-1-many: 1 recursive call
    assert.deepEqual(compact_list(cons(1, nil)), [1]);
    assert.deepEqual(compact_list(cons(8, nil)), [8]);

    // 0-1-many: 2+ recursive calls
    assert.deepEqual(compact_list(cons(1, cons(2, nil))), [1, 2]);
    assert.deepEqual(compact_list(cons(3, cons(2, cons(1, nil)))), [3, 2, 1]);
  });

  it('explode_array', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepEqual(explode_array([]), nil);

    // 0-1-many: 1 recursive call
    assert.deepEqual(explode_array([1]), cons(1, nil));
    assert.deepEqual(explode_array([8]), cons(8, nil));

    // 0-1-many: 2+ recursive calls
    assert.deepEqual(explode_array([1, 2]), cons(1, cons(2, nil)));
    assert.deepEqual(explode_array([1, 2, 3]), cons(1, cons(2, cons(3, nil))));
  });

});