import * as assert from 'assert';
import { explode } from './char_list';
import { cons, explode_array, nil } from './list';
import { findHighlights, getNextHighlight, parseHighlightLines, parseHighlightText } from './parser';


describe('parser', function() {

  it('parseHighlightLines', function() {
    assert.deepEqual(parseHighlightLines(""), explode_array([]));
    assert.deepEqual(
      parseHighlightLines("Red hi there"),
      explode_array([
        {color: 'red', text: 'hi there'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text\nBlue really? more?"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
        {color: 'blue', text: 'really? more?'},
      ]));
  });

  it('getNextHighlight', function() {
    // first branch
    assert.strictEqual(getNextHighlight(explode("")), undefined);

    // second branch
    assert.strictEqual(getNextHighlight(explode("ab")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc")), undefined);

    // third branch
    assert.strictEqual(getNextHighlight(explode("ab[red")), undefined);
    assert.strictEqual(getNextHighlight(explode("[red")), undefined);

    // fourth branch
    assert.strictEqual(getNextHighlight(explode("abc[red|")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc[red|def")), undefined);

    // fifth branch
    assert.deepStrictEqual(getNextHighlight(explode("my [red|ball] is great")),
        ["my ", {color: "red", text: "ball"}, explode(" is great")]);
    assert.deepStrictEqual(getNextHighlight(explode("grass is [green|itchy]")),
        ["grass is ", {color: "green", text: "itchy"}, explode("")]);
  });

  it('findHighlights', function() {
    //One input for the base case that has no recursive calls when an empty list is passed
    //The 0 in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(nil), nil);

    //Two cases where a list of length 1 is passed and has no highlighting
    //This is another base case with 0 recursive calls, the 0 in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("hello")), cons({color: "white", text: "hello"}, 
    nil));
    assert.deepStrictEqual(findHighlights(explode("My name is Janvi")), 
    cons({color: "white", text: "My name is Janvi"}, nil));

    //Two cases where a list of length 1 is passed but has highlighting 
    //This is has 1 recursive call using the first branch, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("[red| I want a dog]")), 
    cons({color: "red", text: " I want a dog"}, nil));
    assert.deepStrictEqual(findHighlights(explode("[blue| Chipotle]")), 
    cons({color: "blue", text: " Chipotle"}, nil));

    //Two cases where a list of length 2 is passed and the last element is a highlighting element
    //This has one recursive call using the second branch, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("my [red|dog]")), 
    cons({color: "white", text: "my "}, cons({color: "red", text: "dog"}, nil)));
    assert.deepStrictEqual(findHighlights(explode("hi [purple| I'm hungry]")),
     cons({color: "white", text: "hi "}, cons({color: "purple", text: " I'm hungry"}, nil)));

    //Two cases where a list of length 2 is passed and the last element 
    //is not a highlighted element and uses the second base case
    //This has one recursive call, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("[red|one] book")), 
    cons({color: "red", text: "one"}, cons({color: "white", text: " book"}, nil)));
    assert.deepStrictEqual(findHighlights(explode("[purple|burrito] Coffee sounds so good")), 
    cons({color: "purple", text: "burrito"}, cons({color: "white", text: 
    " Coffee sounds so good"}, nil)));

    //Two cases where a list of length 2 is passed and the last element is a highligting element
    //This has two recursive calls using the first branch, the many in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("[red|one][purple|I hate books lol]")), 
    cons({color: "red", text: "one"}, cons({color: "purple", text: "I hate books lol"}, nil)));
    assert.deepStrictEqual(findHighlights(explode("[red|one][pink|burrito]")), 
    cons({color: "red", text: "one"},  cons({color: "pink", text: "burrito"}, nil)));

    //Two cases where a list of length 4 is passed and the last element is not a highlighted element
    //This has two recursive calls using the second branch, the many in the 0-1-many heuristic
    assert.deepStrictEqual(findHighlights(explode("my [red|favorite] book [blue|The great Gatsby]")), 
    cons({color: "white", text: "my "}, cons({color: "red", text: "favorite"}, 
    cons({color: "white", text: " book "}, cons({color: "blue", text: "The great Gatsby"}, nil)))));
    assert.deepStrictEqual(findHighlights(explode("my [red|favorite] hi [purple|yum]")), 
    cons({color: "white", text: "my "}, cons({color: "red", text: "favorite"}, 
    cons({color: "white", text: " hi "}, cons({color: "purple", text: "yum"}, nil)))));

  });

  // TODO: Uncomment to test
  it('parseHighlightText', function() {
    assert.deepEqual(parseHighlightText(""), explode_array([]));
    assert.deepEqual(
      parseHighlightText("my [red|favorite] book"),
      explode_array([
        {color: 'white', text: 'my '},
        {color: 'red', text: 'favorite'},
        {color: 'white', text: ' book'},
      ]));
  });

});
