import * as assert from 'assert';
import { fib, fastFib, fastFib2, nextFib } from './fib';


describe('fib', function() {

  it('fib', function() {
    assert.strictEqual(fib(0), 0);
    assert.strictEqual(fib(1), 1);
    assert.strictEqual(fib(2), 1);
    assert.strictEqual(fib(3), 2);
    assert.strictEqual(fib(11), 89);
  });

  it('fastFib', function() {
    assert.deepStrictEqual(fastFib(1), {curFib: 1, prevFib: 0});
    assert.deepStrictEqual(fastFib(2), {curFib: 1, prevFib: 1});
    assert.deepStrictEqual(fastFib(3), {curFib: 2, prevFib: 1});
    assert.deepStrictEqual(fastFib(11), {curFib: 89, prevFib: 55});
  });

  it('fastFib2', function() {
    assert.deepStrictEqual(fastFib2(1), [0, 1]);
    assert.deepStrictEqual(fastFib2(2), [1, 1]);
    assert.deepStrictEqual(fastFib2(3), [1, 2]);
    assert.deepStrictEqual(fastFib2(11), [55, 89]);
  });

  it('nextFib', function() {
    assert.deepStrictEqual(nextFib(0), 0);
    assert.deepStrictEqual(nextFib(1), 1);
    assert.deepStrictEqual(nextFib(2), 2);
    assert.deepStrictEqual(nextFib(3), 3);
    assert.deepStrictEqual(nextFib(4), 5);
    assert.deepStrictEqual(nextFib(5), 5);
    assert.deepStrictEqual(nextFib(6), 8);
    assert.deepStrictEqual(nextFib(7), 8);
    assert.deepStrictEqual(nextFib(9), 13);
    assert.deepStrictEqual(nextFib(54), 55);
    assert.deepStrictEqual(nextFib(55), 55);
    assert.deepStrictEqual(nextFib(56), 89);
  });

});
