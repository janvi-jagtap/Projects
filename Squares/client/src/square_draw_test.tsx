import * as assert from 'assert';
import React from 'react';
import { nil, cons } from './list';
import { solid, split } from './square';
import { SquareNodeElem, ignoreClick } from './square_draw';


describe('square_draw', function() {

  it('SquareElem', function() {
    const S0 = solid("red");
    assert.deepEqual(
        SquareNodeElem({square: S0, width: 100, height: 100, path: nil}),
        <td className="square-solid red" style={{width: '100px', height: '100px'}}
            onClick={ignoreClick}> </td>);

    const S1 = split(solid("red"), solid("orange"), solid("yellow"), solid("green"));
    assert.deepEqual(
        SquareNodeElem({square: S1, width: 100, height: 100, path: nil}),
        <td className="square-split"><table cellSpacing={0}>
          <tbody>
            <tr>
              <SquareNodeElem square={solid("red")} width={50} height={50}
                          path={cons("NW", nil)} onClick={undefined} selected={undefined}/>
              <SquareNodeElem square={solid("orange")} width={50} height={50}
                          path={cons("NE", nil)} onClick={undefined} selected={undefined}/>
            </tr>
            <tr>
              <SquareNodeElem square={solid("yellow")} width={50} height={50}
                          path={cons("SW", nil)} onClick={undefined} selected={undefined}/>
              <SquareNodeElem square={solid("green")} width={50} height={50}
                          path={cons("SE", nil)} onClick={undefined} selected={undefined}/>
            </tr>
          </tbody>
        </table></td>);

    const S2 = split(solid("red"), solid("orange"), solid("yellow"),
        split(solid("red"), solid("orange"), solid("yellow"), solid("green")));
    assert.deepEqual(
        SquareNodeElem({square: S2, width: 200, height: 200, path: cons("SE", nil)}),
        <td className="square-split"><table cellSpacing={0}>
          <tbody>
            <tr>
              <SquareNodeElem square={solid("red")} width={100} height={100}
                          path={cons("NW", cons("SE", nil))} onClick={undefined} selected={undefined}/>
              <SquareNodeElem square={solid("orange")} width={100} height={100}
                          path={cons("NE", cons("SE", nil))} onClick={undefined} selected={undefined}/>
            </tr>
            <tr>
              <SquareNodeElem square={solid("yellow")} width={100} height={100}
                          path={cons("SW", cons("SE", nil))} onClick={undefined} selected={undefined}/>
              <SquareNodeElem square={split(solid("red"), solid("orange"), solid("yellow"), solid("green"))}
                          width={100} height={100}
                          path={cons("SE", cons("SE", nil))} onClick={undefined} selected={undefined}/>
            </tr>
          </tbody>
        </table></td>);
  });

});