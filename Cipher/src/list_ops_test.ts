import * as assert from 'assert';
import { cons, nil } from './list';
import { explode } from './char_list';
import { last, prefix, suffix } from './list_ops';


describe('list_ops', function() {

  it('last', function() {
    // Error case branch
    assert.throws(() => last(nil), Error);

    // 0-1-many: base case
    assert.deepEqual(last(explode("a")), "a".charCodeAt(0));
    assert.deepEqual(last(explode("_")), "_".charCodeAt(0));

    // 0-1-many: one recursive call
    assert.deepEqual(last(explode("hm")), "m".charCodeAt(0));
    assert.deepEqual(last(explode("hu")), "u".charCodeAt(0));

    // 0-1-many: many recursive calls
    assert.deepEqual(last(explode("hub")), "b".charCodeAt(0));
    assert.deepEqual(last(explode("stray")), "y".charCodeAt(0));
    assert.deepEqual(last(explode("shrug")), "g".charCodeAt(0));
  });

  it('prefix', function() {
    //0-1-many heuristic, two cases for base case when list is empty and non-zero number is passed
    assert.throws(() => prefix(2, nil), Error);
    assert.throws(() => prefix(3, nil), Error);

    //0-1-many heuristic, two cases for base case because the number was 0
    assert.deepStrictEqual(prefix(0, explode("g")), nil);
    assert.deepStrictEqual(prefix(0, cons("a".charCodeAt(0), explode("m"))), nil);

    //0-1-many heuristic, two cases for when one recursive call is made because 1 is passed
    assert.deepStrictEqual(prefix(1, explode("e")), explode("e"));
    assert.deepStrictEqual(prefix(1, explode("o")), explode("o"));

    //0-1-many heuristic, two cases for when more than 1 recursive call is made
    assert.deepStrictEqual(prefix(2, cons("e".charCodeAt(0), 
                          cons("a".charCodeAt(0), explode("f")))), 
                          cons("e".charCodeAt(0), explode("a")));
    assert.deepStrictEqual(prefix(2, cons("s".charCodeAt(0), 
                          cons("k".charCodeAt(0), explode("t")))), 
                          cons("s".charCodeAt(0), explode("k")));
    
    //0-1-many heuristic, two cases for when more than 1 recursive call is made but error is thrown
    assert.throws(() => prefix(3, cons("t".charCodeAt(0), explode("p"))), Error);
    assert.throws(() => prefix(3, cons("q".charCodeAt(0), explode("r"))), Error);  
  });

  it('suffix', function() {
    //0-1-many heuristic, two cases for base case when list is empty and non-zero number is passed
    assert.throws(() => suffix(2, nil), Error);
    assert.throws(() => suffix(3, nil), Error);

    //0-1-many heuristic, two cases for base case because the number was 0
    assert.deepStrictEqual(suffix(0, explode("g")), explode("g"));
    assert.deepStrictEqual(suffix(0, cons("a".charCodeAt(0), explode("m"))), 
                          cons("a".charCodeAt(0), explode("m")));

    //0-1-many heuristic, two cases for when one recursive call is made because 1 is passed
    assert.deepStrictEqual(suffix(1, explode("e")), nil);
    assert.deepStrictEqual(suffix(1, explode("o")), nil);

     //0-1-many heuristic, two cases for when more than 1 recursive call is made   
    assert.deepStrictEqual(suffix(2, cons("e".charCodeAt(0), 
                          cons("a".charCodeAt(0), explode("f")))), explode("f"));
    assert.deepStrictEqual(suffix(2, cons("s".charCodeAt(0), 
                          cons("k".charCodeAt(0), explode("t")))), explode("t"));

    //0-1-many heuristic, two cases for when more than 1 recursive call is made but error is thrown
    assert.throws(() => suffix(3, cons("t".charCodeAt(0), explode("p"))), Error);
    assert.throws(() => suffix(3, cons("q".charCodeAt(0), explode("r"))), Error);  
  });

});
