import * as assert from 'assert';
import { NW, SE, GREEN, RED, ROUND, Square, Row, rnil, rcons, qnil, qcons, STRAIGHT, NE, SW } from './quilt';
import { PatternA, PatternB, PatternC, PatternD, PatternE } from './patterns';


describe('patterns', function() {

  const nw_round_green: Square = {shape: ROUND, color: GREEN, corner: NW};
  const nw_round_red: Square = {shape: ROUND, color: RED, corner: NW};
  const ne_round_green: Square = {shape: ROUND, color: GREEN, corner: NE};
  const ne_round_red: Square = {shape: ROUND, color: RED, corner: NE};
  const se_round_green: Square = {shape: ROUND, color: GREEN, corner: SE};
  const se_round_red: Square = {shape: ROUND, color: RED, corner: SE};
  const sw_round_green: Square = {shape: ROUND, color: GREEN, corner: SW};
  const sw_round_red: Square = {shape: ROUND, color: RED, corner: SW};
  const se_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: SE};
  const se_straight_red: Square = {shape: STRAIGHT, color: RED, corner: SE};
  const nw_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: NW};
  const nw_straight_red: Square = {shape: STRAIGHT, color: RED, corner: NW};

  

  it('PatternA', function() {
    const row_green: Row = rcons(nw_round_green, rcons(nw_round_green, rnil));
    const row_red: Row = rcons(nw_round_red, rcons(nw_round_red, rnil));

    //The base case the 0 in the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternA(0), qnil);
    assert.deepStrictEqual(PatternA(0, "GREEN"), qnil);
    assert.deepStrictEqual(PatternA(0, "RED"), qnil);

    //The cases when 1 recursive call is made in the 1 in 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternA(1), qcons(row_green, qnil));
    assert.deepStrictEqual(PatternA(1, "GREEN"), qcons(row_green, qnil));
    assert.deepStrictEqual(PatternA(1, "RED"), qcons(row_red, qnil));

    //Two cases for the many recursve calls subdomain for the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternA(2), qcons(row_green, qcons(row_green, qnil)));
    assert.deepStrictEqual(PatternA(4),
          qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
    assert.deepStrictEqual(PatternA(2, "GREEN"), qcons(row_green, qcons(row_green, qnil)));
    assert.deepStrictEqual(PatternA(4, "GREEN"),
          qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
    assert.deepStrictEqual(PatternA(2, "RED"), qcons(row_red, qcons(row_red, qnil)));
    assert.deepStrictEqual(PatternA(4, "RED"),
          qcons(row_red, qcons(row_red, qcons(row_red, qcons(row_red, qnil)))));

    // Two cases to check that the function throws an exception when tbe number is negative
    //Checks for when there is no color passed, when green is passed, and when red is passed
    assert.throws(() => PatternA(-1), Error);
    assert.throws(() => PatternA(-8), Error);
    assert.throws(() => PatternA(-1, GREEN), Error);
    assert.throws(() => PatternA(-8, GREEN), Error);
    assert.throws(() => PatternA(-1, RED), Error);
    assert.throws(() => PatternA(-8, RED), Error);
  });

  it ('PatternB', function() {
    const row_green: Row = rcons(se_straight_green, rcons(nw_straight_green, rnil));
    const row_red: Row = rcons(se_straight_red, rcons(nw_straight_red, rnil));

    //The base case the 0 in the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed    
    assert.deepStrictEqual(PatternB(0), qnil);
    assert.deepStrictEqual(PatternB(0, "GREEN"), qnil);
    assert.deepStrictEqual(PatternB(0, "RED"), qnil);

    //The cases when 1 recursive call is made in the 1 in 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternB(1), qcons(row_green, qnil));
    assert.deepStrictEqual(PatternB(1, "GREEN"), qcons(row_green, qnil));
    assert.deepStrictEqual(PatternB(1, "RED"), qcons(row_red, qnil));

    //Two cases for the many recursve calls subdomain for the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternB(2), qcons(row_green, qcons(row_green, qnil)));
    assert.deepStrictEqual(PatternB(4),
          qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
    assert.deepStrictEqual(PatternB(2, "GREEN"), qcons(row_green, qcons(row_green, qnil)));
    assert.deepStrictEqual(PatternB(4, "GREEN"),
          qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
    assert.deepStrictEqual(PatternB(2, "RED"), qcons(row_red, qcons(row_red, qnil)));
    assert.deepStrictEqual(PatternB(4, "RED"),
          qcons(row_red, qcons(row_red, qcons(row_red, qcons(row_red, qnil)))));

    // Two cases to check that the function throws an exception when tbe number is negative
    //Checks for when there is no color passed, when green is passed, and when red is passed
    assert.throws(() => PatternB(-1), Error);
    assert.throws(() => PatternB(-8), Error);
    assert.throws(() => PatternB(-1, GREEN), Error);
    assert.throws(() => PatternB(-8, GREEN), Error);
    assert.throws(() => PatternB(-1, RED), Error);
    assert.throws(() => PatternB(-8, RED), Error);
  });

  it ('PatternC', function() {
    const row_green1 = rcons(ne_round_green, rcons(nw_round_green, rnil));
    const row_green2 = rcons(se_round_green, rcons(sw_round_green, rnil));
    const row_red1 = rcons(ne_round_red, rcons(nw_round_red, rnil));
    const row_red2 = rcons(se_round_red, rcons(sw_round_red, rnil));
    
    //The base case the 0 in the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternC(0), qnil);
    assert.deepStrictEqual(PatternC(0, "GREEN"), qnil);
    assert.deepStrictEqual(PatternC(0, "RED"), qnil);

    //The cases when 1 recursive call is made in the 1 in 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternC(2), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternC(2, "GREEN"), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternC(2, "RED"), qcons(row_red1, qcons(row_red2, qnil)));
    
    //Two cases for the many recursve calls subdomain for the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternC(4), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternC(6), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))))));
    assert.deepStrictEqual(PatternC(4, "GREEN"), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternC(6, "GREEN"), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))))));   
    assert.deepStrictEqual(PatternC(4, "RED"), 
          qcons(row_red1, qcons(row_red2, qcons(row_red1, qcons(row_red2, qnil)))));
    assert.deepStrictEqual(PatternC(6, "RED"), 
          qcons(row_red1, qcons(row_red2, qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qcons(row_red2, qnil)))))));  
          
    // Two cases to check that the function throws an exception when tbe number is odd 
    // TWo cases to check that the function throws and exception when the number is negative
    //Checks for when there is no color passed, when green is passed, and when red is passed
    assert.throws(() => PatternC(-1), Error);
    assert.throws(() => PatternC(-8), Error);
    assert.throws(() => PatternC(1), Error);
    assert.throws(() => PatternC(5), Error);
    assert.throws(() => PatternC(-1, GREEN), Error);
    assert.throws(() => PatternC(-8, GREEN), Error);
    assert.throws(() => PatternC(1, GREEN), Error);
    assert.throws(() => PatternC(5, GREEN), Error);
    assert.throws(() => PatternC(-1, RED), Error);
    assert.throws(() => PatternC(-8, RED), Error);
    assert.throws(() => PatternC(1, RED), Error);
    assert.throws(() => PatternC(5, RED), Error);
  });

  it ('PatternD', function() {
    const row_green1 = rcons(se_round_green, rcons(sw_round_green, rnil));
    const row_green2 = rcons(ne_round_green, rcons(nw_round_green, rnil));
    const row_red1 = rcons(se_round_red, rcons(sw_round_red, rnil));
    const row_red2 = rcons(ne_round_red, rcons(nw_round_red, rnil));

    //The base case the 0 in the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternD(0), qnil);
    assert.deepStrictEqual(PatternD(0, "GREEN"), qnil);
    assert.deepStrictEqual(PatternD(0, "RED"), qnil);

    //The cases when 1 recursive call is made in the 1 in 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternD(2), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternD(2, "GREEN"), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternD(2, "RED"), qcons(row_red1, qcons(row_red2, qnil)));

    //Two cases for the many recursve calls subdomain for the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternD(4), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternD(6), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))))));
    assert.deepStrictEqual(PatternD(4, "GREEN"), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternD(6, "GREEN"), 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))))));   
    assert.deepStrictEqual(PatternD(4, "RED"), 
          qcons(row_red1, qcons(row_red2, qcons(row_red1, qcons(row_red2, qnil)))));
    assert.deepStrictEqual(PatternD(6, "RED"), 
          qcons(row_red1, qcons(row_red2, qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qcons(row_red2, qnil)))))));
    
    // Two cases to check that the function throws an exception when tbe number is odd 
    // TWo cases to check that the function throws and exception when the number is negative
    //Checks for when there is no color passed, when green is passed, and when red is passed
    assert.throws(() => PatternD(-1), Error);
    assert.throws(() => PatternD(-8), Error);
    assert.throws(() => PatternD(1), Error);
    assert.throws(() => PatternD(5), Error);
    assert.throws(() => PatternD(-1, GREEN), Error);
    assert.throws(() => PatternD(-8, GREEN), Error);
    assert.throws(() => PatternD(1, GREEN), Error);
    assert.throws(() => PatternD(5, GREEN), Error);
    assert.throws(() => PatternD(-1, RED), Error);
    assert.throws(() => PatternD(-8, RED), Error);
    assert.throws(() => PatternD(1, RED), Error);
    assert.throws(() => PatternD(5, RED), Error);
  });

  it ('PatternE', function() {
    const row_green1: Row = rcons(nw_straight_green, rcons(se_straight_green, rnil));
    const row_green2: Row = rcons(se_straight_green, rcons(nw_straight_green, rnil));
    const row_red1: Row = rcons(nw_straight_red, rcons(se_straight_red, rnil));
    const row_red2: Row = rcons(se_straight_red, rcons(nw_straight_red, rnil));

    //The two base cases, the 0 in the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternE(0), qnil);
    assert.deepStrictEqual(PatternE(0, "GREEN"), qnil);
    assert.deepStrictEqual(PatternE(0, "RED"), qnil);
    assert.deepStrictEqual(PatternE(1), qcons(row_green1, qnil));
    assert.deepStrictEqual(PatternE(1, "GREEN"), qcons(row_green1, qnil));
    assert.deepStrictEqual(PatternE(1, "RED"), qcons(row_red1, qnil));

    //The two cases when 1 recursive call is made in the 1 in 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed
    assert.deepStrictEqual(PatternE(2), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternE(2, "GREEN"), qcons(row_green1, qcons(row_green2, qnil)));
    assert.deepStrictEqual(PatternE(2, "RED"), qcons(row_red1, qcons(row_red2, qnil)));
    assert.deepStrictEqual(PatternE(3), qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qnil))));
    assert.deepStrictEqual(PatternE(3, "GREEN"), qcons(row_green1, 
          qcons(row_green2, qcons(row_green1, qnil))));
    assert.deepStrictEqual(PatternE(3, "RED"), qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qnil))));

    //Two cases for the many recursve calls subdomain for the 0-1-many heuristic
    //When there is no color passed, when green is passed, and when red is passed    
    assert.deepStrictEqual(PatternE(4), qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternE(4, "GREEN"), qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qnil)))));
    assert.deepStrictEqual(PatternE(4, "RED"), qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qcons(row_red2, qnil)))));
    assert.deepStrictEqual(PatternE(7), qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qnil))))))));
    assert.deepStrictEqual(PatternE(7, "GREEN"), qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qcons(row_green2, qcons(row_green1, qcons(row_green2, 
          qcons(row_green1, qnil))))))));
    assert.deepStrictEqual(PatternE(7, "RED"), qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qcons(row_red2, qcons(row_red1, qcons(row_red2, 
          qcons(row_red1, qnil))))))));
  
    // Two cases to check that the function throws an exception when tbe number is negative
    //Checks for when there is no color passed, when green is passed, and when red is passed
    assert.throws(() => PatternE(-1), Error);
    assert.throws(() => PatternE(-8), Error);
    assert.throws(() => PatternE(-1, GREEN), Error);
    assert.throws(() => PatternE(-8, GREEN), Error);
    assert.throws(() => PatternE(-1, RED), Error);
    assert.throws(() => PatternE(-8, RED), Error);
  });


});
