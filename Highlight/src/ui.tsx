import React from 'react';
import { List, cons, nil, compact_list } from './list';
import { ColorList } from './color_list';
import { Highlight } from './parser';
import './ui.css'


/**
 * Returns HTML that displays a form asking the user for inputs to a color
 * search or a highlighting operation.
 */
export const ShowForm = (_: {}): JSX.Element => {
    return (<div>
        <h3>Find Colors</h3>
        <form action="/" method="get">
          <div>
            <label htmlFor="word">Containing Text:</label>
            <input type="text" id="word" name="word" style={{marginLeft: '5px'}}></input>
          </div>

          <div style={{marginTop: '15px'}}>
            <input type="submit" value="Search"></input>
          </div>
        </form>

        <h3 style={{marginTop: '50px'}}>Highlighter</h3>
        <form action="/" method="get">
          <p>Type in the text to display below as a series of lines, with each line
            starting with the name of the color for that text.</p>

          <textarea name="lines" rows={10} cols={80}></textarea>

          <div style={{marginTop: '10px'}}>
            <input type="submit" value="Highlight"></input>
          </div>
        </form>
      </div>);
};


/**
 * Returns HTML that shows all of the colors that include the given text.
 * @param props Contains a text field with the text to look for in color names
 * @return DIV containing a list of cards, one for each color whose name
 *     includes the text, where each card says the color name and has its
 *     background color set to the actual color
 */
export const ShowColors = (props: {text: string, colors: ColorList}): JSX.Element => {
  const names = props.colors.findMatchingNames(props.text);
  return <div>{compact_list(getColorCards(names, props.colors))}</div>
};

// Map a list of names into a list of HTML elements that display each color.
const getColorCards = (names: List<string>, colors: ColorList): List<JSX.Element> => {
  if (names === nil) {
    return nil;
  } else {
    const [bg, fg] = colors.getColorCss((names.hd.toLowerCase()));
    return cons(
        <span className="color-border" key={names.hd}>
          <span className="color-card"
                style={{backgroundColor: bg, color: fg}}>{names.hd}</span>
        </span>,
        getColorCards(names.tl, colors));
  }
};


/**
 * Returns HTML that shows all of the text given, concatenated in the order
 * given, where each text is shown with the highlight as the background
 * @param props Contains a highlights field that has a list of highlights to show
 * @return DIV containing a list of spans, one for each highlight, where the
 *     text in the span is the text specified and the background color of the
 *     span is the highlight color
 */
export const ShowHighlights =
    (props: {highlights: List<Highlight>, colors: ColorList}): JSX.Element => {
  return <div>{compact_list(getHighlights(props.highlights, 0, props.colors))}</div>;
};

// Maps the list of highlights into a list of spans showing them.
const getHighlights = 
    (highlights: List<Highlight>, key: number, colors: ColorList): List<JSX.Element> => {
  if (highlights === nil) {
    return nil;
  } else {
    const h = highlights.hd;
    const [bg, fg] = colors.getColorCss(h.color.toLowerCase());
    return cons(
        <span className="highlight" key={key}
              style={{backgroundColor: bg, color: fg}}>{h.text}</span>,
        getHighlights(highlights.tl, key+1, colors));
  }
};
