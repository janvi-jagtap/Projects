import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, ROUND, RED, Square, rnil, rcons, qnil, qcons, Row } from './quilt';
import { sew, symmetrize, sflip_vert, rflip_vert, qflip_vert, sflip_horz, rflip_horz, qflip_horz } from './quilt_ops';


describe('quilt_ops', function() {

  const nw_round_green: Square = {shape: ROUND, color: GREEN, corner: NW};
  const nw_round_red: Square = {shape: ROUND, color: RED, corner: NW};
  const ne_round_green: Square = {shape: ROUND, color: GREEN, corner: NE};
  const ne_round_red: Square = {shape: ROUND, color: RED, corner: NE};
  const se_round_green: Square = {shape: ROUND, color: GREEN, corner: SE};
  const se_round_red: Square = {shape: ROUND, color: RED, corner: SE};
  const sw_round_green: Square = {shape: ROUND, color: GREEN, corner: SW};
  const sw_round_red: Square = {shape: ROUND, color: RED, corner: SW};




  it('sflip_vert', function() {

    //The two cases for when the square's corner is NW and it changes to SW
    assert.deepStrictEqual(sflip_vert(nw_round_green), sw_round_green);
    assert.deepStrictEqual(sflip_vert(nw_round_red), sw_round_red);

    //The two cases for when the square's corner is NE and it changes to SE
    assert.deepStrictEqual(sflip_vert(ne_round_green), se_round_green);
    assert.deepStrictEqual(sflip_vert(ne_round_red), se_round_red);

    //The two cases for when the square's corner is SE and it changes to NE
    assert.deepStrictEqual(sflip_vert(se_round_green), ne_round_green);
    assert.deepStrictEqual(sflip_vert(se_round_red), ne_round_red);

    //The two cases for when the square's corner is SW and it changes to NW
    assert.deepStrictEqual(sflip_vert(sw_round_green), nw_round_green);
    assert.deepStrictEqual(sflip_vert(sw_round_red), nw_round_red);
  });

  it('rflip_vert', function() {
    
    //The base case when no recursive calls are made, the 0 in the 0-1-many heuristic
    assert.deepStrictEqual(rflip_vert(rnil), rnil);

    //Two cases for when one recursive call is made, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(rflip_vert(rcons(ne_round_green, rnil)), rcons(se_round_green, rnil));
    assert.deepStrictEqual(rflip_vert(rcons(sw_round_red, rnil)), rcons(nw_round_red, rnil));
    

    //Two cases for when more than one recursive call is made, the many in the 0-1-many heuristic
    assert.deepStrictEqual(rflip_vert(rcons(se_round_green, rcons(sw_round_green, rnil))), 
                                      rcons(ne_round_green, rcons(nw_round_green, rnil)));
    assert.deepStrictEqual(rflip_vert(rcons(ne_round_red, rcons(nw_round_red, rnil))), 
                                      rcons(se_round_red, rcons(sw_round_red, rnil)));

 
  });

  it('qflip_vert', function() {
    const row1: Row = rcons(ne_round_green, rcons(nw_round_green, rnil));
    const row2: Row = rcons(se_round_green, rcons(sw_round_green, rnil));
    const row3: Row = rcons(sw_round_red, rcons(se_round_red, rnil));
    const row4: Row = rcons(nw_round_red, rcons(ne_round_red, rnil));

    //The base case when no recursive calls are made, the 0 in the 0-1-many heuristic
    assert.deepStrictEqual(qflip_vert(qnil), qnil);

    //Two cases for when one recursive call is made, the 1 in the 0-1-many heurisitc
    assert.deepStrictEqual(qflip_vert(qcons(row1, qnil)), qcons(row2, qnil));
    assert.deepStrictEqual(qflip_vert(qcons(row3, qnil)), qcons(row4, qnil));

    //Two cases for when more than one recursive call is made, the many in the 0-1-many heuristic
    assert.deepStrictEqual(qflip_vert(qcons(row1, qcons(row3, qnil))), qcons(row4, qcons(row2, qnil)));
    assert.deepStrictEqual(qflip_vert(qcons(row3, qcons(row2, qnil))), qcons(row1, qcons(row4, qnil)));

  });

  it('sflip_horz', function() {

    //The two cases for when the square's corner is NW and it changes to NE
    assert.deepStrictEqual(sflip_horz(nw_round_green), ne_round_green);
    assert.deepStrictEqual(sflip_horz(nw_round_red), ne_round_red);
    
    //The two cases for when the square's corner is NE and it changes to NW
    assert.deepStrictEqual(sflip_horz(ne_round_green), nw_round_green);
    assert.deepStrictEqual(sflip_horz(ne_round_red), nw_round_red);
    
    //The two cases for when the square's corner is SE and it changes to SW
    assert.deepStrictEqual(sflip_horz(se_round_green), sw_round_green);
    assert.deepStrictEqual(sflip_horz(se_round_red), sw_round_red);
    
    //The two cases for when the square's corner is SW and it changes to SE
    assert.deepStrictEqual(sflip_horz(sw_round_green), se_round_green);
    assert.deepStrictEqual(sflip_horz(sw_round_red), se_round_red);
  });

  const row1: Row = rcons(ne_round_green, rcons(se_round_green, rnil));
  const row2: Row = rcons(sw_round_green, rcons(nw_round_green, rnil));
  const row3: Row = rcons(nw_round_red, rcons(sw_round_red, rnil));
  const row4: Row = rcons(se_round_red, rcons(ne_round_red, rnil));

  it('rflip_horz', function() {

    //The base case when no recursive call are made, the 0 in the 0-1-many heurisitic
    assert.deepStrictEqual(rflip_horz(rnil), rnil);

    //Two cases when one recursive call is made, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(rflip_horz(rcons(sw_round_green, rnil)), rcons(se_round_green, rnil));
    assert.deepStrictEqual(rflip_horz(rcons(ne_round_red, rnil)), rcons(nw_round_red, rnil));

    //Two cases when more than one recursive call is made, the many in the 0-1-many heuristic
    assert.deepStrictEqual(rflip_horz(row1), row2);
    assert.deepStrictEqual(rflip_horz(row3), row4);
  });

  it('qflip_horz', function() {
    
    //The base case when no recursive calls are made, the 0 in the 0-1-many heuristic
    assert.deepStrictEqual(qflip_horz(qnil), qnil);
    
    //Two cases when one recursive call is made, the 1 in the 0-1-many heuristic
    assert.deepStrictEqual(qflip_horz(qcons(row1, qnil)), qcons(row2, qnil));
    assert.deepStrictEqual(qflip_horz(qcons(row3, qnil)), qcons(row4, qnil));

    //Two cases when more than one recursive call is made, the many in the 0-1-many heuristic
    assert.deepStrictEqual(qflip_horz(qcons(row1, qcons(row3, qnil))), qcons(row2, qcons(row4, qnil)));
    assert.deepStrictEqual(qflip_horz(qcons(row4, qcons(row2, qnil))), qcons(row3, qcons(row1, qnil)));
  });

  const nw_sq: Square = {corner: NW, color: GREEN, shape: ROUND};
  const ne_sq: Square = {corner: NE, color: GREEN, shape: ROUND};
  const se_sq: Square = {corner: SE, color: GREEN, shape: ROUND};
  const sw_sq: Square = {corner: SW, color: GREEN, shape: ROUND};

  it('sew', function() {
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    const r12 = rcons(se_sq, rcons(sw_sq, rnil));
    const r2 = rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil))));
    const r22 = rcons(se_sq, rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rnil))));

    // invalid case: (qnil, !qnil)
    assert.throws(() => sew(qnil, qcons(r1, qnil)), Error);
    assert.throws(() => sew(qnil, qcons(r1, qcons(r1, qnil))), Error);

    // invalid case: (!qnil, qnil)
    assert.throws(() => sew(qcons(r1, qnil), qnil), Error);
    assert.throws(() => sew(qcons(r1, qcons(r1, qnil)), qnil), Error);

    // 0-1-many: base case
    assert.deepStrictEqual(sew(qnil, qnil), qnil);

    // 0-1-many: one recursive call
    assert.deepStrictEqual(sew(qcons(r1, qnil), qcons(r1, qnil)), qcons(r2, qnil));
    assert.deepStrictEqual(sew(qcons(r12, qnil), qcons(r12, qnil)), qcons(r22, qnil));

    // 0-1-many: many recursive calls
    assert.deepStrictEqual(
        sew(qcons(r1, qcons(r1, qnil)), qcons(r1, qcons(r1, qnil))),
        qcons(r2, qcons(r2, qnil)));
    assert.deepStrictEqual(
        sew(qcons(r12, qcons(r12, qcons(r12, qnil))), 
            qcons(r12, qcons(r12, qcons(r12, qnil)))),
        qcons(r22, qcons(r22, qcons(r22, qnil))));
  });

  it('symmetrize', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(symmetrize(qnil), qnil);
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));

    // 0-1-many: one recursive call
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));
    assert.deepStrictEqual(symmetrize(qcons(rcons(se_sq, rnil), qnil)),
        qcons(rcons(se_sq, rcons(sw_sq, rnil)),
            qcons(rcons(ne_sq, rcons(nw_sq, rnil)), qnil)));

    // 0-1-many: many recursive calls
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qnil)),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qnil)));
    const r2 = rcons(sw_sq, rcons(se_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qcons(r2, qnil))),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qcons(
                    rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
                    qcons(
                        rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                        qnil)))));
  });

});
