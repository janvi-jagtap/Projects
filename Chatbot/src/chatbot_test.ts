import * as assert from 'assert';
import { WordPattern } from './patterns';
import { chatResponse, applyPattern, matchPattern, assemble } from './chatbot';


describe('chatbot', function() {

  it('matchPattern', function() {
    const words1 = ['a', 'b', 'c', 'd'];
    assert.deepStrictEqual(
        matchPattern(words1, [['b', 'e']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words1, [['b', 'c']]), [['a'], ['d']]);
    assert.deepStrictEqual(
        matchPattern(words1, [['a', 'b']]), [[], ['c', 'd']]);
    assert.deepStrictEqual(
        matchPattern(words1, [['c', 'd']]), [['a', 'b'], []]);

    const words2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['e', 'z']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['e', 'f']]), [['a'], ['d'], ['g']]);
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['d', 'e']]), [['a'], [], ['f', 'g']]);
    assert.deepStrictEqual(
        matchPattern(words2, [['a', 'b'], ['f', 'g']]), [[], ['c', 'd', 'e'], []]);

    const words3 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['h', 'z']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['h', 'i']]),
        [['a'], ['d'], ['g'], ['j']]);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['i', 'j']]),
        [['a'], ['d'], ['g', 'h'], []]);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['g', 'h']]),
        [['a'], ['d'], [], ['i', 'j']]);
  });

  const PATTERNS: WordPattern[] = [
      { name: "foo",
        contains: [['foo']],
        responses: [
            ['why', 0, 'and', 'not', 1],
            [0, ',', 'is', 'that', 'so?'],
          ]},
      { name: "my",
        contains: [['my']],
        responses: [['talk', 'more', 'about', 'your', 1]]},
      { name: "bar",
        contains: [['bar']],
        responses: [['what', 'about', 1, '?']]}
    ];


  it('applyPattern', function() {
    const used = new Map<string, number>();
    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['arg0'], ['arg1']], used),
        ['why', 'arg0', 'and', 'not', 'arg1']);
    assert.strictEqual(used.size, 1)
    assert.strictEqual(used.get("foo"), 0);

    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['arg0'], ['arg1']], used),
        ['arg0', ',', 'is', 'that', 'so?']);
    assert.strictEqual(used.size, 1)
    assert.strictEqual(used.get("foo"), 1);

    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['A'], ['B']], used),
        ['why', 'A', 'and', 'not', 'B']);
    assert.strictEqual(used.size, 1)
    assert.strictEqual(used.get("foo"), 0);

    assert.deepStrictEqual(
        applyPattern(PATTERNS[2], [['arg0'], ['arg1']], used),
        ['what', 'about', 'arg1', '?']);
    assert.strictEqual(used.size, 2)
    assert.strictEqual(used.get("foo"), 0);
    assert.strictEqual(used.get("bar"), 0);
  });

  it('chatResponse', function() {
    const memory: string[][] = [];
    const used = new Map<string, number>();
    assert.deepStrictEqual(
        chatResponse(['arg0', 'my', 'foo', 'arg1'], used, memory, PATTERNS),
        ['why', 'arg0', 'my', 'and', 'not', 'arg1']);
    assert.strictEqual(used.size, 1)
    assert.strictEqual(used.get("foo"), 0);
    assert.strictEqual(memory.length, 0)

    assert.deepStrictEqual(
        chatResponse(['arg2', 'my', 'bar', 'arg3'], used, memory, PATTERNS),
        ['what', 'about', 'arg3', '?']);
    assert.strictEqual(used.size, 3)
    assert.strictEqual(used.get("bar"), 0);
    assert.strictEqual(used.get("foo"), 0);
    assert.strictEqual(used.get("my"), 0);
    assert.strictEqual(memory.length, 1)

    assert.deepStrictEqual(
        chatResponse(['arg4', 'foo', 'arg5'], used, memory, PATTERNS),
        ['arg4', ',', 'is', 'that', 'so?']);
    assert.strictEqual(used.size, 3)
    assert.strictEqual(used.get("bar"), 0);
    assert.strictEqual(used.get("foo"), 1);
    assert.strictEqual(used.get("my"), 0);
    assert.strictEqual(memory.length, 1)

    assert.deepStrictEqual(
        chatResponse(['arg5', 'baz', 'arg6'], used, memory, PATTERNS),
        ['talk', 'more', 'about', 'your', 'bar', 'arg3']);
    assert.strictEqual(used.size, 3);
    assert.strictEqual(used.get("bar"), 0);
    assert.strictEqual(used.get("foo"), 1);
    assert.strictEqual(used.get("my"), 0);
    assert.strictEqual(memory.length, 0)

    assert.deepStrictEqual(
        chatResponse(['arg2', 'baz', 'arg3'], used, memory, PATTERNS),
        ["I'm", "not", "sure", "I", "understand", "you", "fully", "."]);
    assert.strictEqual(used.size, 4);
    assert.strictEqual(used.get(".none"), 0);
    assert.strictEqual(used.get("bar"), 0);
    assert.strictEqual(used.get("foo"), 1);
    assert.strictEqual(used.get("my"), 0);
    assert.strictEqual(memory.length, 0)
  });

  it('assemble', function() {
    assert.deepStrictEqual(assemble([], [['a'], ['b']]), []);
    assert.deepStrictEqual(assemble(['foo'], [['a'], ['b']]), ['foo']);
    assert.deepStrictEqual(assemble([0], [['a'], ['b', 'c']]), ['a']);
    assert.deepStrictEqual(assemble([1], [['a'], ['b', 'c']]), ['b', 'c']);
    assert.deepStrictEqual(
        assemble(['d', 0], [['a'], ['b', 'c']]), ['d', 'a']);
    assert.deepStrictEqual(
        assemble(['d', 1], [['a'], ['b', 'c']]), ['d', 'b', 'c']);
    assert.deepStrictEqual(
        assemble(['d', 0, 'e'], [['a'], ['b', 'c']]), ['d', 'a', 'e']);
    assert.deepStrictEqual(
        assemble(['d', 1, 'e'], [['a'], ['b', 'c']]), ['d', 'b', 'c', 'e']);
    assert.deepStrictEqual(
        assemble(
            ['the', 'quick', 1, 2, 'jumped', 'over', 'the', 'lazy', 0],
            [['dog'], ['brown'], ['fox']]),
        ['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog']);
  });

});