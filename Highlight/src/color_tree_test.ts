import * as assert from 'assert';
import { empty, node } from './color_node';
import { makeBst, lookup, makeColorTree } from './color_tree';
import { explode_array, nil, cons } from './list';
import { ColorList } from './color_list';

describe('color_tree', function() {

    // TODO: Uncomment given example tests and add more test cases

    it('make_bst', function() {
        //Base case, the only 0 in the 0-1-many heuristic
        assert.deepStrictEqual(makeBst(nil), empty);
        
        //These are two imputs that have 1 as the depth of recursion
        //The 1 in the 0-1-many heuristic
        assert.deepStrictEqual(makeBst(explode_array([
             ['Blue', '#0000FF', true],
           ])), node(['Blue', '#0000FF', true], empty, empty));
        assert.deepStrictEqual(makeBst(explode_array([
            ['Cyan', '#00FFFF', false],
        ])), node(['Cyan', '#00FFFF', false], empty, empty));

        //These are two inputs that are lists of length 2 that have 2 as the depth of recursion
        //It has a depth of 2 but at total of only 3 recursive calls are made
        //The many in the 0-1-many heuristic   
        assert.deepStrictEqual(makeBst(explode_array([
            ['Blue', '#0000FF', true], ['Cyan', '#00FFFF', false]
            ])), node(['Cyan', '#00FFFF', false], node(['Blue', '#0000FF', true], 
            empty, empty), empty));  
        assert.deepStrictEqual(makeBst(explode_array([
            ['blanchedalmond', '#FFEBCD', false], ['cornflowerblue', '#6495ED', true]
            ])), node(['cornflowerblue', '#6495ED', true], node(['blanchedalmond', 
            '#FFEBCD', false], empty, empty), empty));    
          
        //These are two inputs that are lists of length 3 that have 2 as the depth of recursion
        //It has a depth of 2 but at total of 4 recursive calls are made
        //The many in the 0-1-many heuristic 
        assert.deepStrictEqual(makeBst(explode_array([
            ['Blue', '#0000FF', true], ['Cyan', '#00FFFF', false], ['darkorchid', '#9932CC', true]
            ])), node(['Cyan', '#00FFFF', false], node(['Blue', '#0000FF', true], empty, empty), 
            node(['darkorchid', '#9932CC', true], empty, empty)));  
        assert.deepStrictEqual(makeBst(explode_array([
            ['blanchedalmond', '#FFEBCD', false], ['cornflowerblue', '#6495ED', true], 
            ['goldenrod', '#DAA520', true]
            ])), node(['cornflowerblue', '#6495ED', true], 
            node(['blanchedalmond', '#FFEBCD', false], empty, empty), 
            node(['goldenrod', '#DAA520', true], 
            empty, empty)));
    });

    it('lookup', function() {
        //Two cases for when an empty tree is passed, one of the base cases
        //The 0 in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Yellow', empty), undefined);
        assert.deepStrictEqual(lookup('Cyan', empty), undefined);

        //Two cases for when a tree with only one node is passed, the second base case
        //The 0 in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Yellow', 
        node(['Yellow', '#FFFF00', false], empty, empty)), 
        ['Yellow', '#FFFF00', false]);
        assert.deepStrictEqual(lookup('Blue', 
        node(['Blue', '#0000FF', true], empty, empty)), 
        ['Blue', '#0000FF', true]);

        //Two cases for when one recursive call is made on the right branch
        //The 1 in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Yellow', 
        node(['Blue', '#0000FF', true], empty, 
        node(['Yellow', '#FFFF00', false], empty, empty))), 
        ['Yellow', '#FFFF00', false]);    
        assert.deepStrictEqual(lookup('Cyan', 
        node(['Blue', '#0000FF', true], empty, 
        node(['Cyan', '#00FFFF', false], empty, empty))), 
        ['Cyan', '#00FFFF', false]);  

        //Two cases for when one recursive call is made on the left branch
        //The 1 in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Blue', 
        node(['Cyan', '#00FFFF', false], node(['Blue', '#0000FF', true], 
        empty, empty), empty)), 
        ['Blue', '#0000FF', true]);
        assert.deepStrictEqual(lookup('Hotpink', 
        node(['Yellow', '#FFFF00', false], node(['Hotpink', '#FF69B4', true], 
        empty, empty), empty)), 
        ['Hotpink', '#FF69B4', true]);

        //Two cases for when two recursive calls are made in the right branch
        //The many in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Yellow', 
        node(['Blue', '#0000FF', true], empty, node(['Hotpink', '#FF69B4', true], empty, 
        node(['Yellow', '#FFFF00', false], empty, empty)))), 
        ['Yellow', '#FFFF00', false]);
        assert.deepStrictEqual(lookup('Hotpink', 
        node(['Blue', '#0000FF', true], empty, node(['Cyan', '#00FFFF', false], empty, 
        node(['Hotpink', '#FF69B4', true], empty, empty)))), 
        ['Hotpink', '#FF69B4', true]);

        //Two cases for when two recursive calls are made in the left branch
        assert.deepStrictEqual(lookup('Blue', 
        node(['Yellow', '#FFFF00', false], node(['Cyan', '#00FFFF', false], 
        node(['Blue', '#0000FF', true], empty, empty), empty), empty)), 
        ['Blue', '#0000FF', true]);
        assert.deepStrictEqual(lookup('Cyan', 
        node(['Yellow', '#FFFF00', false], node(['Hotpink', '#FF69B4', true], 
        node(['Cyan', '#00FFFF', false], empty, empty), empty), empty)), 
        ['Cyan', '#00FFFF', false]);

        //Two cases for when two recursive calls are made 
        //first in the left branch, then the right branch
        //The many in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Hotpink', 
        node(['Yellow', '#FFFF00', false], node(['Cyan', '#00FFFF', false], empty, 
        node(['Hotpink', '#FF69B4', true], empty, empty)), empty)), 
        ['Hotpink', '#FF69B4', true]);
        assert.deepStrictEqual(lookup('Cyan', 
        node(['Yellow', '#FFFF00', false], node(['Blue', '#0000FF', true], empty, 
        node(['Cyan', '#00FFFF', false], empty, empty)), empty)), 
        ['Cyan', '#00FFFF', false]);

        //Two cases for when two recursive calls are made 
        //First in the right branch, then the left branch
        //The many in the 0-1-many heuristic
        assert.deepStrictEqual(lookup('Cyan', 
        node(['Blue', '#0000FF', true], empty, node(['Hotpink', '#FF69B4', true], 
        node(['Cyan', '#00FFFF', false], empty, empty), empty))), 
        ['Cyan', '#00FFFF', false]);
        assert.deepStrictEqual(lookup('Darkviolet', 
        node(['Cyan', '#00FFFF', false], empty, node(['Hotpink', '#FF69B4', true], 
        node(['Darkviolet', '#9400D3', true], empty, empty), empty))), 
        ['Darkviolet', '#9400D3', true]);

    });

    const colors: ColorList = makeColorTree();

    it('findMatchingNames', function() {
      assert.deepEqual(colors.findMatchingNames("doesnotexist"), nil);
      assert.deepEqual(colors.findMatchingNames("notacolor"), nil);
      assert.deepEqual(colors.findMatchingNames("indigo"), cons("indigo", nil));
      assert.deepEqual(colors.findMatchingNames("azure"), cons("azure", nil));
      assert.deepEqual(colors.findMatchingNames("lavender"),
          cons("lavender", cons("lavenderblush", nil)));
      assert.deepEqual(colors.findMatchingNames("pink"),
          cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
    });
  
    it('getColorCss', function() {
      assert.deepEqual(colors.getColorCss("lavender"), ['#E6E6FA', '#101010']);
      assert.deepEqual(colors.getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
    });
});