import { ColorInfo, COLORS } from './colors';
import { List, cons, nil } from './list';

// TODO: add interfaces and classes here
/**
 * A list of colors 
 */
export interface ColorList {
  /**
   * @param text: The text in question
   * @returns obj
   */
  findMatchingNames: (text: string) => List<string>;

  /**
   * 
   * @param text The text in question
   * @returns The background color and foreground color
   */
  getColorCss: (text: string) => readonly [string, string];
}

class SimpleColorList implements ColorList {
  //RI: this.colors = COLORS
  //AF: obj = this.colors
  readonly colors: List<ColorInfo>;

  //Creates the list of colors with all the info from COLORS
  constructor(colors: List<ColorInfo>) {
    this.colors = colors;
  }

  // @returns findMathchingNamesIn(text, obj)
  findMatchingNames = (text: string): List<string> => findMatchingNamesIn(text, this.colors);

  //@returns getColorCssIn(text, obj);
  getColorCss = (text: string): readonly [string, string] => getColorCssIn(text, this.colors);
}

const list: ColorList = new SimpleColorList(COLORS);

/** Returns a list that has all the colors and it's info
 * @returns the list of colors
 */
export const makeSimpleColorList = (): ColorList => {
  return list;
}


/** Returns a new list containing just the names of those colors that include the
  * given text.
  * @param text: The text in question
  * @param colors: The full list of colors
  * @returns The sublist of colors containing those colors whose names contain
  * the given text.
*/
export const findMatchingNamesIn =
    (text: string, colors: List<ColorInfo>): List<string> => {
  if (colors === nil) {
    return nil;
  } else {
    // Note: the _ prevents the typechecker froom complaining about  
    // our defining these variables and not using them which we must
    // do to avoid tuple indexing
    const [color, _css, _foreground] = colors.hd;
    if (color.includes(text)) {
      return cons(color, findMatchingNamesIn(text, colors.tl));
    } else {
      return findMatchingNamesIn(text, colors.tl);
    }
  }
};


/**
 * Returns the background and foreground CSS colors to highlight with this color.
 * @param name: Name of the color to look for
 * @throws Error if there is no such color
 * @returns (bg, fg) where bg is the CSS background color and fg is foreground
 */
const getColorCssIn =
    (name: string, colors: List<ColorInfo>): readonly [string, string] => {
  if (colors === nil) {
    throw new Error(`no color called "${name}"`);
  } else {
    const [color, css, foreground] = colors.hd;
    if (color === name) {
      return [css, foreground ? '#F0F0F0' : '#101010'];
    } else {
      return getColorCssIn(name, colors.tl);
    }
  }
};
