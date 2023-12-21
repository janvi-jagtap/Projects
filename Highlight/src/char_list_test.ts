import * as assert from 'assert';
import { nil, cons } from './list';
import { compact, explode } from './char_list';


describe('char_list', function() {

   const a_code: number = "a".charCodeAt(0);
   const b_code: number = "b".charCodeAt(0);
   const c_code: number = "c".charCodeAt(0);

   it('explode', function() {
    // 0-1-many heuristic with 2 cases for 1 and many recursive calls
    assert.deepEqual(explode(""), nil);
    assert.deepEqual(explode("a"), cons(a_code, nil));
    assert.deepEqual(explode("b"), cons(b_code, nil));
    assert.deepEqual(explode("ab"), cons(a_code, cons(b_code, nil)));
    assert.deepEqual(explode("abc"), cons(a_code, cons(b_code, cons(c_code, nil))));
  });

  it('compact', function() {
    // 0-1-many heuristic with 2 cases for 1 and many recursive calls
    assert.deepEqual(compact(nil), "");
    assert.deepEqual(compact(cons(a_code, nil)), "a");
    assert.deepEqual(compact(cons(c_code, nil)), "c");
    assert.deepEqual(compact(cons(a_code, cons(b_code, nil))), "ab");
    assert.deepEqual(compact(cons(a_code, cons(b_code, cons(c_code, nil)))), "abc");
  });

});