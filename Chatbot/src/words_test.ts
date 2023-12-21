import * as assert from 'assert';
import { replaceWords, splitWords, wordsContain, joinWords, substitute } from './words';


describe('words', function() {

  it('substitute', function() {
    const reps = new Map([
      ["hello", "bye"],
      ["banana", "yellow"],
      ["pears", "green"],
      ["grapes", "purple"]
    ]);

    //No loops run
    const a: string[] = [];
    substitute(a, reps);
    assert.deepStrictEqual(a, []);

    //Loop run once but no replacement (two cases)
    const b: string[] = ["no"];
    substitute(b, reps);
    assert.deepStrictEqual(b, ["no"]);
    const c: string[] = ["hi there"];
    substitute(c, reps);
    assert.deepStrictEqual(c, ["hi there"]);

    //Loop run once and there is a replacement (two cases)
    const d: string[] = ["hello"];
    substitute(d, reps);
    assert.deepStrictEqual(d, ["bye"]);
    const e: string[] = ["banana"];
    substitute(e, reps);
    assert.deepStrictEqual(e, ["yellow"]);

    //Loop run twice when both are replaced
    const f: string[] = ["banana", "hello"];
    substitute(f, reps);
    assert.deepStrictEqual(f, ["yellow", "bye"]);
    const g: string[] = ["grapes", "pears"]; 
    substitute(g, reps);
    assert.deepStrictEqual(g, ["purple", "green"]);

    //Loop run twice when neither are replaced
    const h: string[] = ["chipotle", "computer"];
    substitute(h, reps);
    assert.deepStrictEqual(h, ["chipotle", "computer"]);
    const i: string[] = ["mouse", "dog"];
    substitute(i, reps);
    assert.deepStrictEqual(i, ["mouse", "dog"]);

    //Loop run twice when only first is replaced
    const j: string[] = ["grapes", "mat"];
    substitute(j, reps);
    assert.deepStrictEqual(j, ["purple", "mat"]);
    const k: string[] = ["pears", "table"];
    substitute(k, reps);
    assert.deepStrictEqual(k, ["green", "table"]);

    //Loop run twice when the second one is replaced
    const l: string[] = ["book", "hello"];
    substitute(l, reps);
    assert.deepStrictEqual(l, ["book", "bye"]);
    const m: string[] = ["binder", "banana"];
    substitute(m, reps);
    assert.deepStrictEqual(m, ["binder", "yellow"]);
  });

  it('replaceWords', function() {
    const repl = new Map([["a", ["a", "b", "c"]], ["d", ["e", "f"]]]);
    assert.deepStrictEqual(replaceWords([], repl), []);
    assert.deepStrictEqual(replaceWords(["the"], repl), ["the"]);
    assert.deepStrictEqual(replaceWords(["a"], repl), ["a", "b", "c"]);
    assert.deepStrictEqual(replaceWords(["the", "a", "dog"], repl),
        ["the", "a", "b", "c", "dog"]);
    assert.deepStrictEqual(replaceWords(["the", "a", "dog", "d"], repl),
        ["the", "a", "b", "c", "dog", "e", "f"]);
  });

  it('splitWords', function() {
    assert.deepStrictEqual(splitWords(""), []);
    assert.deepStrictEqual(splitWords(" "), []);
    assert.deepStrictEqual(splitWords("."), ["."]);
    assert.deepStrictEqual(splitWords("a"), ["a"]);
    assert.deepStrictEqual(splitWords("abc"), ["abc"]);
    assert.deepStrictEqual(splitWords("ab,"), ["ab", ","]);
    assert.deepStrictEqual(splitWords("ab,c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab ,c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab, c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab , c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("a b , c"), ["a", "b", ",", "c"]);
    assert.deepStrictEqual(splitWords("abc, def! gh"), ["abc", ",", "def", "!", "gh"]);
    assert.deepStrictEqual(splitWords("abc def  gh"), ["abc", "def", "gh"]);
  });

  it('wordsContain', function() {
    assert.strictEqual(wordsContain([], ["a"]), -1);
    assert.strictEqual(wordsContain(["a", "b"], ["a"]), 0);
    assert.strictEqual(wordsContain(["c", "a", "b"], ["a"]), 1);
    assert.strictEqual(wordsContain(["c", "a", "c", "d"], ["d"]), 3);
    assert.strictEqual(wordsContain(["c", "a", "d", "c", "e"], ["a"]), 1);
    assert.strictEqual(wordsContain(["c", "a", "d", "c", "e"], ["f"]), -1);

    assert.strictEqual(wordsContain([], ["a", "b"]), -1);
    assert.strictEqual(wordsContain(["a", "b"], ["a", "b"]), 0);
    assert.strictEqual(wordsContain(["c", "a", "b"], ["a", "b"]), 1);
    assert.strictEqual(wordsContain(["c", "a", "c", "d"], ["a", "c"]), 1);
    assert.strictEqual(wordsContain(["c", "a", "d", "c", "e"], ["a", "c"]), -1);

    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["a", "b", "c"]), 0);
    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["a", "b", "d"]), -1);
    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["b", "c", "d"]), 1);
    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["b", "c", "a"]), -1);
    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["c", "d", "e"]), 2);
    assert.strictEqual(wordsContain(["a", "b", "c", "d", "e"], ["c", "d", "c"]), -1);

    assert.strictEqual(wordsContain(["A", "B", "C", "D", "E"], ["c", "d", "e"]), 2);
    assert.strictEqual(wordsContain(["A", "B", "C", "D", "E"], ["c", "d", "c"]), -1);
  });

  it('joinWords', function() {
    assert.strictEqual(joinWords([]), "");
    assert.strictEqual(joinWords(["a"]), "a");
    assert.strictEqual(joinWords([","]), ",");
    assert.strictEqual(joinWords(["a", "!"]), "a!");
    assert.strictEqual(joinWords(["a", "b"]), "a b");
    assert.strictEqual(joinWords(["abc", "def"]), "abc def");
    assert.strictEqual(joinWords(["a", ",", "b"]), "a, b");
    assert.strictEqual(joinWords(["a", ",", "b", "c", "!"]), "a, b c!");
    assert.strictEqual(joinWords(["a", ",", "b", "c", "!", "d"]), "a, b c! d");
    assert.strictEqual(joinWords(["what", "?", "!", "?"]), "what?!?");
  });
});
