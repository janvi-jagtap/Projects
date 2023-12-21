import * as assert from 'assert';
import { solid, toJson, fromJson, findNode, Dir, Square, split, replace, rotateSquare } from './square';
import { cons, nil, List } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });
  const listNW1: List<Dir> = cons("NW", nil);
  const listNE1: List<Dir> = cons("NE", nil);
  const listSW1: List<Dir> = cons("SW", nil);
  const listSE1: List<Dir> = cons("SE", nil);

  const r1: Square = solid("white");
  const r2: Square = solid("blue");

  const splitSquare1: Square = split(solid("green"), solid("blue"), solid("orange"), solid("purple"));
  const splitSquare2: Square = split(solid("yellow"), solid("white"), solid("red"), solid("green"));

  const NEr1: Square = split(solid("green"), r1, solid("orange"), solid("purple"));
  const NEr2: Square = split(solid("yellow"), r2, solid("red"), solid("green"));
  const NWr1: Square = split(r1, solid("blue"), solid("orange"), solid("purple"));
  const NWr2: Square = split(r2, solid("white"), solid("red"), solid("green"));
  const SEr1: Square = split(solid("green"), solid("blue"), solid("orange"), r1);
  const SEr2: Square = split(solid("yellow"), solid("white"), solid("red"), r2);
  const SWr1: Square = split(solid("green"), solid("blue"), r1, solid("purple"));
  const SWr2: Square = split(solid("yellow"), solid("white"), r2, solid("green"));



  const splitSquareNE1: Square = split(solid("green"), splitSquare2, solid("orange"), solid("purple"));
  const splitSquareNW1: Square = split(splitSquare2, solid("blue"), solid("orange"), solid("purple"));
  const splitSquareSE1: Square = split(solid("green"), solid("blue"), solid("orange"), splitSquare2);
  const splitSquareSW1: Square = split(solid("green"), solid("blue"), splitSquare2, solid("purple"));

  const splitSquareNE2: Square = split(solid("green"), splitSquare1, solid("orange"), solid("purple"));
  const splitSquareNW2: Square = split(splitSquare1, solid("blue"), solid("orange"), solid("purple"));
  const splitSquareSE2: Square = split(solid("green"), solid("blue"), solid("orange"), splitSquare1);
  const splitSquareSW2: Square = split(solid("green"), solid("blue"), splitSquare1, solid("purple"));

  const extraNE1: Square = split(solid("green"), splitSquareNE1, solid("orange"), solid("purple"));
  const extraNW1: Square = split(solid("green"), splitSquareNW1, solid("orange"), solid("purple"));
  const extraSW1: Square = split(solid("green"), splitSquareSW1, solid("orange"), solid("purple"));
  const extraSE1: Square = split(solid("green"), splitSquareSE1, solid("orange"), solid("purple"));

  const extraRNE2: Square = split(solid("green"), NEr2, solid("orange"), solid("purple"))
  const extraRNE1: Square = split(solid("green"), NEr1, solid("orange"), solid("purple"))
  const extraRNW2: Square = split(solid("green"), NWr2, solid("orange"), solid("purple"))
  const extraRNW1: Square = split(solid("green"), NWr1, solid("orange"), solid("purple"))
  const extraRSE2: Square = split(solid("green"), SEr2, solid("orange"), solid("purple"))
  const extraRSE1: Square = split(solid("green"), SEr1, solid("orange"), solid("purple"))
  const extraRSW2: Square = split(solid("green"), SWr2, solid("orange"), solid("purple"))
  const extraRSW1: Square = split(solid("green"), SWr1, solid("orange"), solid("purple"))


  const extraNE11: Square = split(solid("green"), extraNE1, solid("orange"), solid("purple"));
  const extraNW11: Square = split(solid("green"), extraNW1, solid("orange"), solid("purple"));
  const extraSW11: Square = split(solid("green"), extraSW1, solid("orange"), solid("purple"));
  const extraSE11: Square = split(solid("green"), extraSE1, solid("orange"), solid("purple"));

  const extraNE2: Square = split(solid("green"), splitSquareNE2, solid("orange"), solid("purple"));
  const extraNW2: Square = split(solid("green"), splitSquareNW2, solid("orange"), solid("purple"));
  const extraSW2: Square = split(solid("green"), splitSquareSW2, solid("orange"), solid("purple"));
  const extraSE2: Square = split(solid("green"), splitSquareSE2, solid("orange"), solid("purple"));

  const extraNE22: Square = split(solid("green"), extraNE2, solid("orange"), solid("purple"));
  const extraNW22: Square = split(solid("green"), extraNW2, solid("orange"), solid("purple"));
  const extraSW22: Square = split(solid("green"), extraSW2, solid("orange"), solid("purple"));
  const extraSE22: Square = split(solid("green"), extraSE2, solid("orange"), solid("purple"));




  it ('findNode', function() {


    //0 recursive calls when the square is solid, two different inputs
    assert.deepStrictEqual(findNode(solid("red"), nil), solid("red"));
    assert.deepStrictEqual(findNode(solid("green"), listNW1), solid("green"));

    //0 recursive calls when p is nil and the square is a split square , one input
    assert.deepStrictEqual(findNode(splitSquare1, nil), undefined);
    assert.deepStrictEqual(findNode(splitSquare2, nil), undefined);

    //One recursive call of list lenghth 1 of NE and it lands on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquare1, listNE1), solid("blue"));
    assert.deepStrictEqual(findNode(splitSquare2, listNE1), solid("white"));

    //One recursive call of list lenghth 1 of NW and it lands on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquare1, listNW1), solid("green"));
    assert.deepStrictEqual(findNode(splitSquare2, listNW1), solid("yellow"));

    //One recursive call of list lenghth 1 of SE and it lands on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquare1, listSE1), solid("purple"));
    assert.deepStrictEqual(findNode(splitSquare2, listSE1), solid("green"));

    //One recursive call of list lenghth 1 of SW and it lands on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquare1, listSW1), solid("orange"));
    assert.deepStrictEqual(findNode(splitSquare2, listSW1), solid("red"));

    //One recursive call of list lenghth 1 of NE and it lands on a split square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNE1, listNE1), undefined);
    assert.deepStrictEqual(findNode(splitSquareNE2, listNE1), undefined);

    //One recursive call of list lenghth 1 of NW and it lands on a split square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNW1, listNW1), undefined);
    assert.deepStrictEqual(findNode(splitSquareNW2, listNW1), undefined);

    //One recursive call of list lenghth 1 of SE and it lands on a split square, two inputs
    assert.deepStrictEqual(findNode(splitSquareSE1, listSE1), undefined);
    assert.deepStrictEqual(findNode(splitSquareSE2, listSE1), undefined);

    //One recursive call of list lenghth 1 of SW and it lands on a split square, two inputs
    assert.deepStrictEqual(findNode(splitSquareSW1, listSW1), undefined);
    assert.deepStrictEqual(findNode(splitSquareSW2, listSW1), undefined);
    
    //Two recursive calls with list of length 2 with the last dir being NE 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNE1, cons("NE", listNE1)), solid("white"));
    assert.deepStrictEqual(findNode(splitSquareNE2, cons("NE", listNE1)), solid("blue"));

    //Two recursive calls with list of length 2 with the last dir being NW 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNE1, cons("NE", listNW1)), solid("yellow"));
    assert.deepStrictEqual(findNode(splitSquareNE2, cons("NE", listNW1)), solid("green"));
    
    //Two recursive calls with list of length 2 with the last dir being SE 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNE1, cons("NE", listSE1)), solid("green"));
    assert.deepStrictEqual(findNode(splitSquareNE2, cons("NE", listSE1)), solid("purple"));

    //Two recursive calls with list of length 2 with the last dir being SW
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(splitSquareNE1, cons("NE", listSW1)), solid("red"));
    assert.deepStrictEqual(findNode(splitSquareNE2, cons("NE", listSW1)), solid("orange"));

    //Two recursive calls with list of length 2 with the last dir being NE 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraNE1, cons("NE", listNE1)), undefined);
    assert.deepStrictEqual(findNode(extraNE2, cons("NE", listNE1)), undefined);

    //Two recursive calls with list of length 2 with the last dir being NW 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraNW1, cons("NE", listNW1)), undefined);
    assert.deepStrictEqual(findNode(extraNW2, cons("NE", listNW1)), undefined);

    //Two recursive calls with list of length 2 with the last dir being SE 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraSE1, cons("NE", listSE1)), undefined);
    assert.deepStrictEqual(findNode(extraSE2, cons("NE", listSE1)), undefined);

    //Two recursive calls with list of length 2 with the last dir being SW
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraSW1, cons("NE", listSW1)), undefined);
    assert.deepStrictEqual(findNode(extraSW2, cons("NE", listSW1)), undefined);

    //Three recursive calls with list of length 3 with the last dir being NE 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(extraNE1, cons("NE", cons("NE", listNE1))), solid("white"));
    assert.deepStrictEqual(findNode(extraNE2, cons("NE", cons("NE", listNE1))), solid("blue"));

    //Three recursive calls with list of length 3 with the last dir being NW 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(extraNE1, cons("NE", cons("NE", listNW1))), solid("yellow"));
    assert.deepStrictEqual(findNode(extraNE2, cons("NE", cons("NE", listNW1))), solid("green"));

    //Three recursive calls with list of length 3 with the last dir being SE 
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(extraNE1, cons("NE", cons("NE", listSE1))), solid("green"));
    assert.deepStrictEqual(findNode(extraNE2, cons("NE", cons("NE", listSE1))), solid("purple"));

    //Three recursive calls with list of length 3 with the last dir being SW
    //and it ends on a solid square, two inputs
    assert.deepStrictEqual(findNode(extraNE1, cons("NE", cons("NE", listSW1))), solid("red"));
    assert.deepStrictEqual(findNode(extraNE2, cons("NE", cons("NE", listSW1))), solid("orange"));

    //Three recursive calls with list of length 3 with the last dir being NE 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraNE11, cons("NE", cons("NE", listNE1))), undefined);
    assert.deepStrictEqual(findNode(extraNE22, cons("NE", cons("NE", listNE1))), undefined);

    //Three recursive calls with list of length 3 with the last dir being NW 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraNW11, cons("NE", cons("NE", listNW1))), undefined);
    assert.deepStrictEqual(findNode(extraNW22, cons("NE", cons("NE", listNW1))), undefined);

    //Three recursive calls with list of length 3 with the last dir being SE 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraSE11, cons("NE", cons("NE", listSE1))), undefined);
    assert.deepStrictEqual(findNode(extraSE22, cons("NE", cons("NE", listSE1))), undefined);

    //Three recursive calls with list of length 3 with the last dir being SW 
    //and it ends on a split square, two inputs
    assert.deepStrictEqual(findNode(extraSW11, cons("NE", cons("NE", listSW1))), undefined);
    assert.deepStrictEqual(findNode(extraSW22, cons("NE", cons("NE", listSW1))), undefined);

  });

  it ('replace', function() {
    //0 recursive calls when p is nil, two inputs
    assert.deepStrictEqual(replace(splitSquare1, nil, r1), r1);
    assert.deepStrictEqual(replace(splitSquare2, nil, r1), r1);

    //0 recursive calls when the path is longer than the square, two inputs
    assert.throws(() => replace(solid("green"), listNE1, r1), Error);
    assert.throws(() => replace(solid("blue"), listNE1, r1), Error);

    //1 recursive call with a list of length 1 in the direction NE, two inputs
    assert.deepStrictEqual(replace(splitSquare1, listNE1, r1), NEr1);
    assert.deepStrictEqual(replace(splitSquare2, listNE1, r2), NEr2);

    //1 recursive call with a list of length 1 in the direction NW, two inputs
    assert.deepStrictEqual(replace(splitSquare1, listNW1, r1), NWr1);
    assert.deepStrictEqual(replace(splitSquare2, listNW1, r2), NWr2);

    //1 recursive call with a list of length 1 in the direction SE, two inputs
    assert.deepStrictEqual(replace(splitSquare1, listSE1, r1), SEr1);
    assert.deepStrictEqual(replace(splitSquare2, listSE1, r2), SEr2);

    //1 recursive call with a list of length 1 in the direction SW, two inputs
    assert.deepStrictEqual(replace(splitSquare1, listSW1, r1), SWr1);
    assert.deepStrictEqual(replace(splitSquare2, listSW1, r2), SWr2);

    //1 recursive call in NE direction with a list of length 2 
    //that's too long for the square, two inputs
    assert.throws(() => replace(splitSquare1, cons("NE",listNE1), r1), Error);
    assert.throws(() => replace(splitSquare2, cons("NE",listNE1), r2), Error);

    //1 recursive call in NW direction with a list of length 2 
    //that's too long for the square, two inputs    
    assert.throws(() => replace(splitSquare1, cons("NW",listNE1), r1), Error);
    assert.throws(() => replace(splitSquare2, cons("NW",listNE1), r2), Error);

    //1 recursive call in SE direction with a list of length 2 
    //that's too long for the square, two inputs    
    assert.throws(() => replace(splitSquare1, cons("SE",listNE1), r1), Error);
    assert.throws(() => replace(splitSquare2, cons("SE",listNE1), r2), Error);

    //1 recursive call in SW direction with a list of length 2 
    //that's too long for the square, two inputs    
    assert.throws(() => replace(splitSquare1, cons("SW",listNE1), r1), Error);
    assert.throws(() => replace(splitSquare2, cons("SW",listNE1), r2), Error);

    //2 recursive calls with list of length 2 and last dir being NE, two inputs
    assert.deepStrictEqual(replace(splitSquareNE1, cons("NE", listNE1), r2), split(solid("green"), NEr2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(splitSquareNE2, cons("NE", listNE1), r1), split(solid("green"), NEr1, solid("orange"), solid("purple")));

    //2 recursive calls with list of length 2 and last dir being NW, two inputs
    assert.deepStrictEqual(replace(splitSquareNE1, cons("NE", listNW1), r2), split(solid("green"), NWr2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(splitSquareNE2, cons("NE", listNW1), r1), split(solid("green"), NWr1, solid("orange"), solid("purple")));

    //2 recursive calls with list of length 2 and last dir being SW, two inputs
    assert.deepStrictEqual(replace(splitSquareNE1, cons("NE", listSW1), r2), split(solid("green"), SWr2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(splitSquareNE2, cons("NE", listSW1), r1), split(solid("green"), SWr1, solid("orange"), solid("purple")));

    //2 recursive calls with list of length 2 and last dir being SE, two inputs
    assert.deepStrictEqual(replace(splitSquareNE1, cons("NE", listSE1), r2), split(solid("green"), SEr2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(splitSquareNE2, cons("NE", listSE1), r1), split(solid("green"), SEr1, solid("orange"), solid("purple")));

    //2 recursive calls in NE direction with a list of length 3 
    //that's too long for the square, two inputs
    assert.throws(() => replace(splitSquareNE1, cons("NE", cons("NE", listNE1)), r1), Error);
    assert.throws(() => replace(splitSquareNE2, cons("NE", cons("NE", listNE1)), r1), Error);

    //2 recursive calls in ending NW direction with a list of length 3 
    //that's too long for the square, two inputs
    assert.throws(() => replace(splitSquareNE1, cons("NE", cons("NE", listNW1)), r1), Error);
    assert.throws(() => replace(splitSquareNE2, cons("NE", cons("NE", listNW1)), r1), Error);

    //2 recursive calls in ending SE direction with a list of length 3 
    //that's too long for the square, two inputs
    assert.throws(() => replace(splitSquareNE1, cons("NE", cons("NE", listSE1)), r1), Error);
    assert.throws(() => replace(splitSquareNE2, cons("NE", cons("NE", listSE1)), r1), Error);

    //2 recursive calls ending in SW direction with a list of length 3 
    //that's too long for the square, two inputs
    assert.throws(() => replace(splitSquareNE1, cons("NE", cons("NE", listSW1)), r1), Error);
    assert.throws(() => replace(splitSquareNE2, cons("NE", cons("NE", listSW1)), r1), Error);

    //3 recursive calls with list of length 3 and last dir being NE, two inputs
    assert.deepStrictEqual(replace(extraNE1, cons("NE", cons("NE", listNE1)), r2), split(solid("green"), extraRNE2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(extraNE2, cons("NE", cons("NE", listNE1)), r1), split(solid("green"), extraRNE1, solid("orange"), solid("purple")));

    //3 recursive calls with list of length 3 and last dir being NW, two inputs
    assert.deepStrictEqual(replace(extraNE1, cons("NE", cons("NE", listNW1)), r2), split(solid("green"), extraRNW2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(extraNE2, cons("NE", cons("NE", listNW1)), r1), split(solid("green"), extraRNW1, solid("orange"), solid("purple")));

    //3 recursive calls with list of length 3 and last dir being SE, two inputs
    assert.deepStrictEqual(replace(extraNE1, cons("NE", cons("NE", listSE1)), r2), split(solid("green"), extraRSE2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(extraNE2, cons("NE", cons("NE", listSE1)), r1), split(solid("green"), extraRSE1, solid("orange"), solid("purple")));

    //3 recursive calls with list of length 3 and last dir being SW, two inputs
    assert.deepStrictEqual(replace(extraNE1, cons("NE", cons("NE", listSW1)), r2), split(solid("green"), extraRSW2, solid("orange"), solid("purple")));
    assert.deepStrictEqual(replace(extraNE2, cons("NE", cons("NE", listSW1)), r1), split(solid("green"), extraRSW1, solid("orange"), solid("purple")));

    //3 recursive calls in ending NE direction with a list of length 4 
    //that's too long for the square, two inputs
    assert.throws(() => replace(extraNE1, cons("NE", cons("NE", cons("NE", listNE1))), r1), Error);
    assert.throws(() => replace(extraNE2, cons("NE", cons("NE", cons("NE", listNE1))), r1), Error);

    //3 recursive calls in ending NW direction with a list of length 4 
    //that's too long for the square, two inputs
    assert.throws(() => replace(extraNE1, cons("NE", cons("NE", cons("NE", listNW1))), r1), Error);
    assert.throws(() => replace(extraNE2, cons("NE", cons("NE", cons("NE", listNW1))), r1), Error);

    //3 recursive calls in ending SE direction with a list of length 4 
    //that's too long for the square, two inputs
    assert.throws(() => replace(extraNE1, cons("NE", cons("NE", cons("NE", listSE1))), r1), Error);
    assert.throws(() => replace(extraNE2, cons("NE", cons("NE", cons("NE", listSE1))), r1), Error);

    //3 recursive calls in ending SW direction with a list of length 4 
    //that's too long for the square, two inputs
    assert.throws(() => replace(extraNE1, cons("NE", cons("NE", cons("NE", listSW1))), r1), Error);
    assert.throws(() => replace(extraNE2, cons("NE", cons("NE", cons("NE", listSW1))), r1), Error);
  });

  it ('rotateSquare', function() {
    
    //If branch where a solid square is passed in and an error is thrown, two inputs
    assert.throws(() => rotateSquare(solid("green")), Error);
    assert.throws(() => rotateSquare(solid("red")), Error);

    //Else branch where a square is successfully rotated, two inputs
    assert.deepStrictEqual(rotateSquare(splitSquare1), split(solid("blue"), solid("purple"), solid("green"), solid("orange")));
    assert.deepStrictEqual(rotateSquare(splitSquare2), split(solid("white"), solid("green"), solid("yellow"), solid("red")));


  });

});
