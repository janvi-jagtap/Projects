import { ColorInfo, COLORS } from './colors';
import { List, nil } from './list';


// Make sure the colors are in sorted order.
// (The list implementation does not assume this but the tree does.)
const checkSorted = (colors: List<ColorInfo>): void => {
  if (colors !== nil && colors.tl !== nil) {
    const [color, _css, _foreground] = colors.hd;
    const [nextColor, _nextCss, _nextForeground] = colors.tl.hd;

    if (!(color < nextColor))
      throw new Error(`not in sorted order: ${color} < ${nextColor}`);
    checkSorted(colors.tl);
  }
};


describe('colors', function() {

  it('sorted', function() {
    checkSorted(COLORS);
  });

});