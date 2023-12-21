import { List, len, nil, split } from './list';
import { COLORS, ColorInfo } from './colors';
import { ColorNode, empty, node } from './color_node';
import { ColorList, findMatchingNamesIn } from './color_list';

/**Returns a tree that's alphabetically sorted with color name
 * Each node has the info on that respective color
 * @param L: A list where each element has info on it's respective color
 * @returns: A tree that's sorted alphabetically by each color name
 * where each color has it's respectiv info still attatched
 */
export const makeBst = (L: List<ColorInfo>): ColorNode => {
  if (L === nil) {
    return empty;
  }
  else {
    const m: number = Math.floor(len(L)/2);
    const [P, S] = split(m, L);
    if (S !== nil) {
        return node(S.hd, makeBst(P), makeBst(S.tl));
    }
    else {
        return empty
    }
  }
};

/** Returns the node in the tree that matches the color passed in
 * @param y: The color which is being looked up
 * @param root: The tree of all the sorted color info
 * @returns: The node of the tree that has all the info for the color that was passed 
*/
export const lookup = (y: string, root: ColorNode): ColorInfo | undefined => {
     if (root === empty) {
        return undefined;
     }
     else {
        const [color, _css_foreground] = root.info
        if (y === color) {
            return root.info;
        }
        else if (y > color) {
            return lookup(y, root.after);
        }
        else {
            return lookup(y, root.before);
        }
    }
};

// TODO: add interfaces, classes, functions here

class ColorTree implements ColorList {
    //RI: this.colors = List<ColorInfo>
    //RI: this.tree = makeBST(this.colors) 
    //AF: obj = this.tree
    readonly colors: List<ColorInfo>;
    readonly tree: ColorNode;

    //Creates the sorted tree from the list of color info
    constructor(colors: List<ColorInfo>) {
        this.colors = colors;
        this.tree = makeBst(this.colors);
    }

    //Returns findMatchingNamesIn(text, colors)
    findMatchingNames = (text: string): List<string> => findMatchingNamesIn(text, this.colors);

    //Returns the background and foreground color from the obj
    getColorCss = (text: string):  readonly [string, string] => {
        const found: ColorInfo | undefined = lookup(text, this.tree);
        if (found === undefined) {
            throw new Error(`no color called "${text}"`);
        }
        else {
        const [_color_, css, foreground] = found;            
        return [css, foreground ? '#F0F0F0' : '#101010'];
        }
    };
}

const tree: ColorList = new ColorTree(COLORS);

/** Returns a sorted tree of all the colors and its info
 * @returns the sorted tree of all the colors and its info
 */
export const makeColorTree = (): ColorList => {
    return tree;
}
