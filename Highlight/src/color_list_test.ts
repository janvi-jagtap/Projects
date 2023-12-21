import * as assert from 'assert';
import { nil, cons } from './list';
import { makeSimpleColorList, ColorList } from './color_list';


describe('color_list', function() {

  const colors: ColorList = makeSimpleColorList();

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