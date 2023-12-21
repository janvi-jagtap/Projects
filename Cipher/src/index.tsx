import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ShowForm, ShowResult } from './ui';


// Parse the arguments to the page. Retrieve the parameters that should be
// supplied on form submit.
const params: URLSearchParams = new URLSearchParams(window.location.search);
const word: string|null = params.get("word");
const algo: string|null = params.get("algo");
const op: string|null = params.get("op");

// Find the element in which to place the UI.
const main: HTMLElement|null = document.getElementById('main')
if (main === null) {
  throw new Error('main element is missing!');
}

// Show the UI with the result if all required parameters were provided/valid.
// Otherwise, show the form.
const root: Root = createRoot(main);
if (word === null ||
    (algo !== "cipher" && algo !== "crazy-caps" && algo !== "pig-latin") ||
    (op !== "encode" && op !== "decode")) {
    root.render(<ShowForm/>);
} else {
    root.render(<ShowResult word={word} algo={algo} op={op}/>);
}
