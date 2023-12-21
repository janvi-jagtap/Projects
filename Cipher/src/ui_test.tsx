import React from 'react';
import * as assert from 'assert';
import { ShowResult } from './ui';


describe('ui', function() {

  it('ShowResult', function() {

    //Two cases for when the cipher encode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "lion", algo: "cipher", op: "encode"}),<p><code>roum</code></p>);  
    assert.deepStrictEqual(  
      ShowResult({word: "batman", algo: "cipher", op: "encode"}),<p><code>pebnem</code></p>);    

    //Two cases for when the cipher decode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "roum", algo: "cipher", op: "decode"}),<p><code>lion</code></p>);       
      assert.deepStrictEqual(
        ShowResult({word: "pebnem", algo: "cipher", op: "decode"}),<p><code>batman</code></p>);

    //Two cases for when the crazy-caps encode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "hello", algo: "crazy-caps", op: "encode"}),<p><code>HeLlO</code></p>);   
    assert.deepStrictEqual(
        ShowResult({word: "cray", algo: "crazy-caps", op: "encode"}),<p><code>CrAy</code></p>);
    
    //Two cases for when the crazy-caps decode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "HeArT", algo: "crazy-caps", op: "decode"}),<p><code>heart</code></p>);
    assert.deepStrictEqual(
      ShowResult({word: "CoFfEe", algo: "crazy-caps", op: "decode"}),<p><code>coffee</code></p>);

    //Two cases for when the pig-latin encode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "call", algo: "pig-latin", op: "encode"}),<p><code>allcay</code></p>);  
    assert.deepStrictEqual(
        ShowResult({word: "chipotle", algo: "pig-latin", op: "encode"}),<p><code>ipotlechay</code></p>);  
    
    //Two cases for when the pig-latin decode algorithm is run
    assert.deepStrictEqual(
      ShowResult({word: "uzzallosay", algo: "pig-latin", op: "decode"}),<p><code>suzzallo</code></p>); 
      assert.deepStrictEqual(
        ShowResult({word: "ouseblay", algo: "pig-latin", op: "decode"}),<p><code>blouse</code></p>);            
  });

});
