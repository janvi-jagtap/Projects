import { replaceWords, wordsContain } from './words';
import { WordPattern } from './patterns'


// List of replacements to make in the input words.
const INPUT_REPLACEMENTS: Map<string, string[]> = new Map([
    ["dont", ["don't"]],
    ["cant", ["can't"]],
    ["wont", ["won't"]],
    ["recollect", ["remember"]],
    ["dreamt", ["dreamed"]],
    ["dreams", ["dream"]],
    ["maybe", ["perhaps"]],
    ["how", ["what"]],
    ["when", ["what"]],
    ["certainly", ["yes"]],
    ["machine", ["computer"]],
    ["computers", ["computer"]],
    ["were", ["was"]],
    ["you're", ["you", "are"]],
    ["i'm", ["i", "am"]],
    ["same", ["alike"]],
  ]);


// List of replacements to make in the output words.
const OUTPUT_REPLACEMENTS: Map<string, string[]> = new Map([
    ["am", ["are"]],
    ["your", ["my"]],
    ["me", ["you"]],
    ["myself", ["yourself"]],
    ["yourself", ["myself"]],
    ["i", ["you"]],
    ["you", ["I"]],
    ["my", ["your"]],
    ["i'm", ["you", "are"]],
  ]);


// Pattern to use if nothing above matches.
const DEFAULT_PATTERN: WordPattern = {
  name: ".none",  // use a word that cannot appear in user input
  contains: [],
  responses: [
    ["I'm", "not", "sure", "I", "understand", "you", "fully", "."],
    ["Please", "go", "on", "."],
    ["What", "does", "that", "suggest", "to", "you", "?"],
    ["Do", "you", "feel", "strongly", "about", "discussing", "such", "things", "?"]
  ]
}


/**
 * Returns the next response from the chatbot.
 * @param words words in the user's message
 * @param lastUsed map from name to the last response used for that word.
 *     (This is kept so that we can avoid reusing them as much as possible.)
 * @param patterns set of word patterns to use
 * @modifies lastUsed, memory
 * @returns words of the response
 */
export const chatResponse = 
    (words: string[], lastUsed: Map<string, number>, memory: string[][],
    patterns: ReadonlyArray<WordPattern>): string[] => {

  // Start by making the substitutions listed above.
  words = replaceWords(words, INPUT_REPLACEMENTS);

  // Try the patterns in the order they appear. Use the first* that matches.
  // Use the next unused reponse for the matching pattern.
  // * The one exception to this is "my", which is instead pushed to memory.
  for (const pat of patterns) {
    const args = matchPattern(words, pat.contains);
    if (args !== undefined) {
      const out_args = [];
      for (const arg of args)
        out_args.push(replaceWords(arg, OUTPUT_REPLACEMENTS));
      const result = applyPattern(pat, args, lastUsed);
      if (pat.name === "my") {
        memory.push(result); 
      } else {
        return result;
      }
    }
  }

  // If we have something saved to memory, then pop and return it. Otherwise,
  // we just make up a default response.
  const result = memory.pop();
  if (result !== undefined) {
    return result;
  } else {
    return applyPattern(DEFAULT_PATTERN, [], lastUsed);
  }
};


/**
 * Returns the arguments from the given words if those words match the given
 * pattern and undefined if not. (See WordPattern above for more info.)
 * @param words words to check against the pattern
 * @param contains list of 1, 2, or 3 sequences of words to look for (in order)
 * @returns the text before, between, and after the required words of the
 *     pattern if they appear and undefined if not
 */
export const matchPattern =
    (words: string[], contains: ReadonlyArray<string>[]):
    string[][] | undefined => {

  if (contains.length < 1 || 3 < contains.length)
    throw new Error(`${contains.length} required word sequences not allowed`);

  const index1 = wordsContain(words, contains[0]);
  if (index1 < 0)
    return undefined;

  const arg1 = words.slice(0, index1);
  const words2 = words.slice(index1 + contains[0].length);
  if (contains.length === 1)
    return [arg1, words2];

  const index2 = wordsContain(words2, contains[1]);
  if (index2 < 0)
    return undefined;

  const arg2 = words2.slice(0, index2);
  const words3 = words2.slice(index2 + contains[1].length);
  if (contains.length === 2)
    return [arg1, arg2, words3];

  const index3 = wordsContain(words3, contains[2]);
  if (index3 < 0)
    return undefined;

  const arg3 = words3.slice(0, index3);
  const words4 = words3.slice(index3 + contains[2].length);
  return [arg1, arg2, arg3, words4];
};


/**
 * Returns the next response applied to the given pattern
 * @param pat pattern that matches
 * @param args arguments from matching the pattern
 * @param lastUsed (see chatResponse)
 * @modifies lastUsed changes the entry for this pattern to indicate which
 *    response was used
 * @returns result of substituting the arguments into the next unused response
 */
export const applyPattern =
    (pat: WordPattern, args: string[][], lastUsed: Map<string, number>):
    string[] => {
  const last = lastUsed.get(pat.name);
  let result: string[] = [];
  if (last !== undefined) {
    const next = (last + 1) % pat.responses.length;
    result = assemble(pat.responses[next], args);
    lastUsed.set(pat.name, next);
  } else {
    result = assemble(pat.responses[0], args);
    lastUsed.set(pat.name, 0);
  }
  return result;
};


/**
 * Returns the result of substituting, for each number in parts, the argument at
 * the corresponding index of args.
 * @param parts mix of words and numbers that indicate arguments to substitute
 * @param args values to substitute for numbers in parts
 * @returns sub(parts, args), where
 *     sub([], args) = []
 *     sub(L @ [w], args) = sub(L) @ [w]         if w is a word
 *     sub(L @ [n], args) = sub(L) @ args[n]     if n is a number
 */
export const assemble =
    (parts: ReadonlyArray<string | number>, args: ReadonlyArray<string>[]):
    string[] => {

  const words: string[] = [];
  let j = 0;

  // Inv: words = sub(parts[0..j-1], args)
  while (j != parts.length) {
    const part = parts[j];
    if (typeof part === 'number') {
      if (part < 0 || args.length <= part)
        throw new Error(`no argument for part ${part} (only ${parts.length} args)`);
      for (const word of args[part])
        words.push(word);
    } else {
      words.push(part);
    }
    j = j + 1;
  }

  return words;
};
