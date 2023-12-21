import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { List } from './list';
import { Highlight, parseHighlightText } from './parser';
import { ShowForm, ShowColors, ShowHighlights } from './ui';
import { ColorList } from './color_list';
import { makeColorTree } from './color_tree';


// Parse the query parameters in the URL.
const params: URLSearchParams = new URLSearchParams(window.location.search);
const word: string|null = params.get("word");
const lines: string|null = params.get("lines");
const colors: ColorList = makeColorTree();


// Find the element in which to place the UI.
const main: HTMLElement|null = document.getElementById('main');
if (main === null) {
  throw new Error("Uh oh! HTML is missing 'main' element");
}

const root: Root = createRoot(main);

try {
  // If the query included a word to search for, show the colors containing that
  if (word !== null) {
    root.render(<React.StrictMode><ShowColors text={word} colors = {colors}/></React.StrictMode>);

  // If the query included a list of lines, then show them highlighted.
  } else if (lines) {
    const highlights: List<Highlight> = parseHighlightText(lines);
    root.render(
        <React.StrictMode>
          <ShowHighlights highlights={highlights} colors = {colors}/>
        </React.StrictMode>);

  // Otherwise, show the form asking them for input.
  } else {
    root.render(<React.StrictMode><ShowForm/></React.StrictMode>);
  }

} catch (e: unknown) {
  if (e instanceof Error) {
    root.render(<React.StrictMode><p>Error: {e.message}</p></React.StrictMode>);
  }
}
