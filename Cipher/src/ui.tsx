import React from 'react';
import { cipher_encode, cipher_decode, crazy_caps_decode, crazy_caps_encode, pig_latin_decode, pig_latin_encode } from './latin_ops';
import { compact, explode } from './char_list';


/** Returns UI that displays a form asking for encode/decode input. */
export const ShowForm = (_: {}): JSX.Element => {
    // TODO: Replace this with something fully functional.
    return (
        <form action="/" method="get">
          <p>Transform your word!</p>
          <input type="text" id="word" name="word"></input>

          <p>Choose your transformation method
          <select name = "algo">
            {<option value = "crazy-caps">crazy-caps</option>}
            {<option value = "cipher">cipher</option>}
            {<option value = "pig-latin">pig-latin</option>}
          </select></p>

          <p>encode<input type="radio" id="" name="op" value="encode"></input></p>
          <p>decode<input type="radio" id="" name="op" value="decode"></input></p>

          <input type="submit" value="Submit"></input>
        </form>);
};


/** Properties expected for the ShowResult UI below. */
export type ShowResultProps = {
    word: string;
    algo: "cipher" | "crazy-caps" | "pig-latin";
    op: "encode" | "decode";
};

/**
 * Returns UI that shows the result of applying the specified operation to the
 * given word.
 */
export const ShowResult = (props: ShowResultProps): JSX.Element => {
    props;  // TODO: remove this (just making the compiler happy)
    if (props.algo === "cipher") {
      if (props.op === "encode") {
        const word: string = compact(cipher_encode(explode(props.word))); 
        return <p><code>{word}</code></p>;
      }
      else {
        const word: string = compact(cipher_decode(explode(props.word)));
        return <p><code>{word}</code></p>;
      }
    }
    else if (props.algo === "crazy-caps") {
      if (props.op === "encode") {
        const word: string = compact(crazy_caps_encode(explode(props.word)));
        return <p><code>{word}</code></p>;
      }
      else {
        const word: string = compact(crazy_caps_decode(explode(props.word)));
        return <p><code>{word}</code></p>;
      }
    }
    else {
      if (props.op === "encode") {
        const word: string = compact(pig_latin_encode(explode(props.word)));
        return <p><code>{word}</code></p>;
      }
      else {
        const word: string = compact(pig_latin_decode(explode(props.word)));
        return <p><code>{word}</code></p>;
      }
    }
};
