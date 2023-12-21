/**
 * Describes a pattern to look for in the user's message. Each contains a list
 * of 1, 2, or 3 subarrays to search for (in that order). If it matches, then
 * the text before, after, and between those subarrays become the arguments to
 * the response patterns listed (substituted where those numbers appear).
 */
export type WordPattern = {
  name: string;
  contains: ReadonlyArray<string>[];  // 0, 1, 2, or 3
  responses: ReadonlyArray<string|number>[];
};


/** List of patterns included in the chat bot. */
export const PATTERNS: ReadonlyArray<WordPattern> = [
  {name: "computer",
   contains: [['computer']],
   responses: [
     ['Do', 'computers', 'worry', 'you', '?'],
     ['Why', 'do', 'you', 'mention', 'computers', '?'],
     ['What', 'do', 'you', 'think', 'machines', 'have', 'to', 'do', 'with', 'your', 'problem', '?'],
     ["Don't", 'you', 'think', 'computers', 'can', 'help', 'people', '?'],
     ['What', 'about', 'machines', 'worrys', 'you', '?'],
     ['What', 'do', 'you', 'think', 'about', 'machines', '?'],
   ]},
  {name: "name",
   contains: [['name']],
   responses: [
     ['I', 'am', 'not', 'interested', 'in', 'names.'],
     ["I've", 'told', 'you', 'before,', 'I', "don't", 'care', 'about', 'names', '--', 'please', 'continue.'],
   ]},
  {name: "alike",
   contains: [['alike']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "like-be",
   contains: [['be'], ['like']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "like-am",
   contains: [['am'], ['like']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "like-is",
   contains: [['is'], ['like']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "like-are",
   contains: [['are'], ['like']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "like-was",
   contains: [['was'], ['like']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "remember",
   contains: [['i', 'remember']],
   responses: [
     ['Do', 'you', 'often', 'think', 'of', 1, '?'],
     ['Does', 'thinking', 'of', 1, 'bring', 'anything', 'else', 'to', 'mind', '?'],
     ['What', 'else', 'do', 'you', 'recollect', '?'],
     ['Why', 'do', 'you', 'recollect', 1, 'just', 'now', '?'],
     ['What', 'in', 'the', 'present', 'situation', 'reminds', 'you', 'of', 1, '?'],
     ['What', 'is', 'the', 'connection', 'between', 'me', 'and', 1, '?'],
   ]},
  {name: "remember-1",
   contains: [['do', 'you', 'remember']],
   responses: [
     ['Did', 'you', 'think', 'I', 'would', 'forget', 1, '?'],
     ['Why', 'do', 'you', 'think', 'I', 'should', 'recall', 1, 'now', '?'],
     ['What', 'about', 1, '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
     ['You', 'mentioned', 1, '?'],
   ]},
  {name: "dreamed",
   contains: [['i', 'dreamed']],
   responses: [
     ['Really,', 1, '?'],
     ['Have', 'you', 'ever', 'fantasized', 1, 'while', 'you', 'were', 'awake', '?'],
     ['Have', 'you', 'ever', 'dreamed', 1, 'before', '?'],
     ['What', 'does', 'that', 'dream', 'suggest', 'to', 'you', '?'],
     ['Do', 'you', 'dream', 'often', '?'],
     ['What', 'persons', 'appear', 'in', 'your', 'dreams', '?'],
     ['Do', 'you', 'believe', 'that', 'dreams', 'have', 'something', 'to', 'do', 'with', 'your', 'problems', '?'],
   ]},
  {name: "if",
   contains: [['if']],
   responses: [
     ['Do', 'you', 'think', 'its', 'likely', 'that', 1, '?'],
     ['Do', 'you', 'wish', 'that', 1, '?'],
     ['What', 'do', 'you', 'know', 'about', 1, '?'],
     ['Really,', 'if', 1, '?'],
   ]},
  {name: "dream",
   contains: [['dream']],
   responses: [
     ['What', 'does', 'that', 'dream', 'suggest', 'to', 'you', '?'],
     ['Do', 'you', 'dream', 'often', '?'],
     ['What', 'persons', 'appear', 'in', 'your', 'dreams', '?'],
     ['Do', 'you', 'believe', 'that', 'dreams', 'have', 'something', 'to', 'do', 'with', 'your', 'problems', '?'],
   ]},
  {name: "was",
   contains: [['was', 'i']],
   responses: [
     ['What', 'if', 'you', 'were', 1, '?'],
     ['Do', 'you', 'think', 'you', 'were', 1, '?'],
     ['Were', 'you', 1, '?'],
     ['What', 'would', 'it', 'mean', 'if', 'you', 'were', 1, '?'],
     ['What', 'does', 1, 'suggest', 'to', 'you', '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "was-1",
   contains: [['i', 'was']],
   responses: [
     ['Were', 'you', 'really', '?'],
     ['Why', 'do', 'you', 'tell', 'me', 'you', 'were', 1, 'now', '?'],
     ['Perhaps', 'I', 'already', 'know', 'you', 'were', 1, '.'],
   ]},
  {name: "was-2",
   contains: [['was', 'you']],
   responses: [
     ['Would', 'you', 'like', 'to', 'believe', 'I', 'was', 1, '?'],
     ['What', 'suggests', 'that', 'I', 'was', 1, '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['Perhaps', 'I', 'was', 1, '.'],
     ['What', 'if', 'I', 'had', 'been', 1, '?'],
   ]},
  {name: "my",
   contains: [['my']],
   responses: [
     ['Lets', 'discuss', 'further', 'why', 'your', 1, '.'],
     ['Earlier', 'you', 'said', 'your', 1, '.'],
     ['But', 'your', 1, '.'],
     ['Does', 'that', 'have', 'anything', 'to', 'do', 'with', 'the', 'fact', 'that', 'your', 1, '?'],
   ]},
  {name: "my-family",
   contains: [['my'], ['family']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-mother",
   contains: [['my'], ['mother']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-mom",
   contains: [['my'], ['mom']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-father",
   contains: [['my'], ['father']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-dad",
   contains: [['my'], ['dad']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-sister",
   contains: [['my'], ['sister']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-brother",
   contains: [['my'], ['brother']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-wife",
   contains: [['my'], ['wife']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-children",
   contains: [['my'], ['children']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-child",
   contains: [['my'], ['child']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'your', 'family.'],
     ['Who', 'else', 'in', 'your', 'family', 3, '?'],
     ['Your', 2, '?'],
     ['What', 'else', 'comes', 'to', 'mind', 'when', 'you', 'think', 'of', 'your', 2, '?'],
   ]},
  {name: "my-11",
   contains: [['my']],
   responses: [
     ['Your', 1, '?'],
     ['Why', 'do', 'you', 'say', 'your', 1, '?'],
     ['Does', 'that', 'suggest', 'anything', 'else', 'which', 'belongs', 'to', 'you', '?'],
     ['Is', 'it', 'important', 'that', 'your', 1, '?'],
   ]},
  {name: "everyone-everyone",
   contains: [['everyone']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "everyone-everybody",
   contains: [['everybody']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "everyone-nobody",
   contains: [['nobody']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "everyone-noone",
   contains: [['noone']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "everybody",
   contains: [['everybody']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "nobody",
   contains: [['nobody']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "noone",
   contains: [['noone']],
   responses: [
     ['Realy,', 1, '?'],
     ['Surely', 'not', 1, '.'],
     ['Can', 'you', 'think', 'of', 'anyone', 'in', 'particular', '?'],
     ['Who,', 'for', 'example?'],
     ['Are', 'you', 'thinking', 'of', 'a', 'very', 'special', 'person', '?'],
     ['Who,', 'may', 'I', 'ask', '?'],
     ['Someone', 'special', 'perhaps', '?'],
     ['You', 'have', 'a', 'particular', 'person', 'in', 'mind,', "don't", 'you', '?'],
     ['Who', 'do', 'you', 'think', "you're", 'talking', 'about', '?'],
   ]},
  {name: "xnone",
   contains: [['xnone']],
   responses: [
     ["I'm", 'not', 'sure', 'I', 'understand', 'you', 'fully.'],
     ['Please', 'go', 'on.'],
     ['What', 'does', 'that', 'suggest', 'to', 'you', '?'],
     ['Do', 'you', 'feel', 'strongly', 'about', 'discussing', 'such', 'things', '?'],
   ]},
  {name: "sorry",
   contains: [['sorry']],
   responses: [
     ['Please', "don't", 'apologise.'],
     ['Apologies', 'are', 'not', 'necessary.'],
     ["I've", 'told', 'you', 'that', 'apologies', 'are', 'not', 'required.'],
   ]},
  {name: "apologise",
   contains: [['apologise']],
   responses: [
     ['Please', "don't", 'apologise.'],
     ['Apologies', 'are', 'not', 'necessary.'],
     ["I've", 'told', 'you', 'that', 'apologies', 'are', 'not', 'required.'],
   ]},
  {name: "perhaps",
   contains: [['perhaps']],
   responses: [
     ['You', "don't", 'seem', 'quite', 'certain.'],
     ['Why', 'the', 'uncertain', 'tone', '?'],
     ["Can't", 'you', 'be', 'more', 'positive', '?'],
     ['You', "aren't", 'sure', '?'],
     ["Don't", 'you', 'know', '?'],
   ]},
  {name: "deutsch",
   contains: [['deutsch']],
   responses: [
     ['I', 'speak', 'only', 'English.'],
     ['I', 'told', 'you', 'before,', 'I', "don't", 'understand', 'German.'],
   ]},
  {name: "francais",
   contains: [['francais']],
   responses: [
     ['I', 'told', 'you', 'before,', 'I', "don't", 'understand', 'French.'],
     ['I', 'speak', 'only', 'English.'],
   ]},
  {name: "italiano",
   contains: [['italiano']],
   responses: [
     ['I', 'speak', 'only', 'English.'],
     ['I', 'told', 'you', 'before,', 'I', "don't", 'understand', 'Italian.'],
   ]},
  {name: "espanol",
   contains: [['espanol']],
   responses: [
     ['I', 'speak', 'only', 'English.'],
     ['I', 'told', 'you', 'before,', 'I', "don't", 'understand', 'Spanish.'],
   ]},
  {name: "hello",
   contains: [['hello']],
   responses: [
     ['How', 'do', 'you', 'do.', 'Please', 'state', 'your', 'problem.'],
     ['Hi.', 'What', 'seems', 'to', 'be', 'your', 'problem', '?'],
   ]},
  {name: "am",
   contains: [['am', 'i']],
   responses: [
     ['Do', 'you', 'believe', 'you', 'are', 1, '?'],
     ['Would', 'you', 'want', 'to', 'be', 1, '?'],
     ['Do', 'you', 'wish', 'I', 'would', 'tell', 'you', 'you', 'are', 1, '?'],
     ['What', 'would', 'it', 'mean', 'if', 'you', 'were', 1, '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "am-1",
   contains: [['am']],
   responses: [
     ['Why', 'do', 'you', 'say', "'am'", '?'],
     ['I', "don't", 'understand', 'that.'],
   ]},
  {name: "are",
   contains: [['are', 'you']],
   responses: [
     ['Why', 'are', 'you', 'interested', 'in', 'whether', 'I', 'am', 1, 'or', 'not', '?'],
     ['Would', 'you', 'prefer', 'if', 'I', "weren't", 1, '?'],
     ['Perhaps', 'I', 'am', 1, 'in', 'your', 'fantasies.'],
     ['Do', 'you', 'sometimes', 'think', 'I', 'am', 1, '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "are-1",
   contains: [['are']],
   responses: [
     ['Did', 'you', 'think', 'they', 'might', 'not', 'be', 1, '?'],
     ['Would', 'you', 'like', 'it', 'if', 'they', 'were', 'not', 1, '?'],
     ['What', 'if', 'they', 'were', 'not', 1, '?'],
     ['Possibly', 'they', 'are', 1, '.'],
   ]},
  {name: "your",
   contains: [['your']],
   responses: [
     ['Why', 'are', 'you', 'concerned', 'over', 'my', 1, '?'],
     ['What', 'about', 'your', 'own', 1, '?'],
     ['Are', 'you', 'worried', 'about', 'someone', "else's", 1, '?'],
     ['Really,', 'my', 1, '?'],
   ]},
  {name: "i-desire",
   contains: [['i', 'desire']],
   responses: [
     ['What', 'would', 'it', 'mean', 'to', 'you', 'if', 'you', 'got', 2, '?'],
     ['Why', 'do', 'you', 'want', 2, '?'],
     ['Suppose', 'you', 'got', 2, 'soon', '?'],
     ['What', 'if', 'you', 'never', 'got', 2, '?'],
     ['What', 'would', 'getting', 2, 'mean', 'to', 'you', '?'],
     ['What', 'does', 'wanting', 2, 'have', 'to', 'do', 'with', 'this', 'discussion', '?'],
   ]},
  {name: "i-want",
   contains: [['i', 'want']],
   responses: [
     ['What', 'would', 'it', 'mean', 'to', 'you', 'if', 'you', 'got', 2, '?'],
     ['Why', 'do', 'you', 'want', 2, '?'],
     ['Suppose', 'you', 'got', 2, 'soon', '?'],
     ['What', 'if', 'you', 'never', 'got', 2, '?'],
     ['What', 'would', 'getting', 2, 'mean', 'to', 'you', '?'],
     ['What', 'does', 'wanting', 2, 'have', 'to', 'do', 'with', 'this', 'discussion', '?'],
   ]},
  {name: "i-need",
   contains: [['i', 'need']],
   responses: [
     ['What', 'would', 'it', 'mean', 'to', 'you', 'if', 'you', 'got', 2, '?'],
     ['Why', 'do', 'you', 'want', 2, '?'],
     ['Suppose', 'you', 'got', 2, 'soon', '?'],
     ['What', 'if', 'you', 'never', 'got', 2, '?'],
     ['What', 'would', 'getting', 2, 'mean', 'to', 'you', '?'],
     ['What', 'does', 'wanting', 2, 'have', 'to', 'do', 'with', 'this', 'discussion', '?'],
   ]},
  {name: "i-sad",
   contains: [['i', 'am'], ['sad']],
   responses: [
     ['I', 'am', 'sorry', 'to', 'hear', 'that', 'you', 'are', 2, '.'],
     ['Do', 'you', 'think', 'that', 'coming', 'here', 'will', 'help', 'you', 'not', 'to', 'be', 2, '?'],
     ["I'm", 'sure', "it's", 'not', 'pleasant', 'to', 'be', 2, '.'],
     ['Can', 'you', 'explain', 'what', 'made', 'you', 2, '?'],
   ]},
  {name: "i-unhappy",
   contains: [['i', 'am'], ['unhappy']],
   responses: [
     ['I', 'am', 'sorry', 'to', 'hear', 'that', 'you', 'are', 2, '.'],
     ['Do', 'you', 'think', 'that', 'coming', 'here', 'will', 'help', 'you', 'not', 'to', 'be', 2, '?'],
     ["I'm", 'sure', "it's", 'not', 'pleasant', 'to', 'be', 2, '.'],
     ['Can', 'you', 'explain', 'what', 'made', 'you', 2, '?'],
   ]},
  {name: "i-depressed",
   contains: [['i', 'am'], ['depressed']],
   responses: [
     ['I', 'am', 'sorry', 'to', 'hear', 'that', 'you', 'are', 2, '.'],
     ['Do', 'you', 'think', 'that', 'coming', 'here', 'will', 'help', 'you', 'not', 'to', 'be', 2, '?'],
     ["I'm", 'sure', "it's", 'not', 'pleasant', 'to', 'be', 2, '.'],
     ['Can', 'you', 'explain', 'what', 'made', 'you', 2, '?'],
   ]},
  {name: "i-sick",
   contains: [['i', 'am'], ['sick']],
   responses: [
     ['I', 'am', 'sorry', 'to', 'hear', 'that', 'you', 'are', 2, '.'],
     ['Do', 'you', 'think', 'that', 'coming', 'here', 'will', 'help', 'you', 'not', 'to', 'be', 2, '?'],
     ["I'm", 'sure', "it's", 'not', 'pleasant', 'to', 'be', 2, '.'],
     ['Can', 'you', 'explain', 'what', 'made', 'you', 2, '?'],
   ]},
  {name: "i-happy",
   contains: [['i', 'am'], ['happy']],
   responses: [
     ['How', 'have', 'I', 'helped', 'you', 'to', 'be', 2, '?'],
     ['Has', 'your', 'treatment', 'made', 'you', 2, '?'],
     ['What', 'makes', 'you', 2, 'just', 'now', '?'],
     ['Can', 'you', 'explan', 'why', 'you', 'are', 'suddenly', 2, '?'],
   ]},
  {name: "i-elated",
   contains: [['i', 'am'], ['elated']],
   responses: [
     ['How', 'have', 'I', 'helped', 'you', 'to', 'be', 2, '?'],
     ['Has', 'your', 'treatment', 'made', 'you', 2, '?'],
     ['What', 'makes', 'you', 2, 'just', 'now', '?'],
     ['Can', 'you', 'explan', 'why', 'you', 'are', 'suddenly', 2, '?'],
   ]},
  {name: "i-glad",
   contains: [['i', 'am'], ['glad']],
   responses: [
     ['How', 'have', 'I', 'helped', 'you', 'to', 'be', 2, '?'],
     ['Has', 'your', 'treatment', 'made', 'you', 2, '?'],
     ['What', 'makes', 'you', 2, 'just', 'now', '?'],
     ['Can', 'you', 'explan', 'why', 'you', 'are', 'suddenly', 2, '?'],
   ]},
  {name: "i-better",
   contains: [['i', 'am'], ['better']],
   responses: [
     ['How', 'have', 'I', 'helped', 'you', 'to', 'be', 2, '?'],
     ['Has', 'your', 'treatment', 'made', 'you', 2, '?'],
     ['What', 'makes', 'you', 2, 'just', 'now', '?'],
     ['Can', 'you', 'explan', 'why', 'you', 'are', 'suddenly', 2, '?'],
   ]},
  {name: "i",
   contains: [['i', 'was']],
   responses: [
     ['What', 'if', 'you', 'were', 1, '?'],
     ['Do', 'you', 'think', 'you', 'were', 1, '?'],
     ['Were', 'you', 1, '?'],
     ['What', 'would', 'it', 'mean', 'if', 'you', 'were', 1, '?'],
     ['What', 'does', 1, 'suggest', 'to', 'you', '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "i-belief",
   contains: [['i', 'belief'], ['i']],
   responses: [
     ['Do', 'you', 'really', 'think', 'so', '?'],
     ['But', 'you', 'are', 'not', 'sure', 'you', 2, '.'],
     ['Do', 'you', 'really', 'doubt', 'you', 2, '?'],
   ]},
  {name: "i-feel",
   contains: [['i', 'feel'], ['i']],
   responses: [
     ['Do', 'you', 'really', 'think', 'so', '?'],
     ['But', 'you', 'are', 'not', 'sure', 'you', 2, '.'],
     ['Do', 'you', 'really', 'doubt', 'you', 2, '?'],
   ]},
  {name: "i-think",
   contains: [['i', 'think'], ['i']],
   responses: [
     ['Do', 'you', 'really', 'think', 'so', '?'],
     ['But', 'you', 'are', 'not', 'sure', 'you', 2, '.'],
     ['Do', 'you', 'really', 'doubt', 'you', 2, '?'],
   ]},
  {name: "i-believe",
   contains: [['i', 'believe'], ['i']],
   responses: [
     ['Do', 'you', 'really', 'think', 'so', '?'],
     ['But', 'you', 'are', 'not', 'sure', 'you', 2, '.'],
     ['Do', 'you', 'really', 'doubt', 'you', 2, '?'],
   ]},
  {name: "i-wish",
   contains: [['i', 'wish'], ['i']],
   responses: [
     ['Do', 'you', 'really', 'think', 'so', '?'],
     ['But', 'you', 'are', 'not', 'sure', 'you', 2, '.'],
     ['Do', 'you', 'really', 'doubt', 'you', 2, '?'],
   ]},
  {name: "i-belief-17",
   contains: [['i'], ['belief'], ['you']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "i-feel-18",
   contains: [['i'], ['feel'], ['you']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "i-think-19",
   contains: [['i'], ['think'], ['you']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "i-believe-20",
   contains: [['i'], ['believe'], ['you']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "i-wish-21",
   contains: [['i'], ['wish'], ['you']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "i-22",
   contains: [['i', 'am']],
   responses: [
     ['Is', 'it', 'because', 'you', 'are', 1, 'that', 'you', 'came', 'to', 'me', '?'],
     ['How', 'long', 'have', 'you', 'been', 1, '?'],
     ['Do', 'you', 'believe', 'it', 'is', 'normal', 'to', 'be', 1, '?'],
     ['Do', 'you', 'enjoy', 'being', 1, '?'],
   ]},
  {name: "i-cannot",
   contains: [['i', 'cannot']],
   responses: [
     ['How', 'do', 'you', 'think', 'that', 'you', "can't", 2, '?'],
     ['Have', 'you', 'tried', '?'],
     ['Perhaps', 'you', 'could', 2, 'now.'],
     ['Do', 'you', 'really', 'want', 'to', 'be', 'able', 'to', 2, '?'],
   ]},
  {name: "i-can't",
   contains: [['i', "can't"]],
   responses: [
     ['How', 'do', 'you', 'think', 'that', 'you', "can't", 2, '?'],
     ['Have', 'you', 'tried', '?'],
     ['Perhaps', 'you', 'could', 2, 'now.'],
     ['Do', 'you', 'really', 'want', 'to', 'be', 'able', 'to', 2, '?'],
   ]},
  {name: "i-25",
   contains: [['i', "don't"]],
   responses: [
     ["Don't", 'you', 'really', 1, '?'],
     ['Why', "don't", 'you', 1, '?'],
     ['Do', 'you', 'wish', 'to', 'be', 'able', 'to', 1, '?'],
     ['Does', 'that', 'trouble', 'you', '?'],
   ]},
  {name: "i-26",
   contains: [['do', 'i', 'feel']],
   responses: [
     ['Tell', 'me', 'more', 'about', 'such', 'feelings.'],
     ['Do', 'you', 'often', 'feel', 1, '?'],
     ['Do', 'you', 'enjoy', 'feeling', 1, '?'],
     ['Of', 'what', 'does', 'feeling', 1, 'remind', 'you', '?'],
   ]},
  {name: "i-27",
   contains: [['i'], ['you']],
   responses: [
     ['Perhaps', 'in', 'your', 'fantasies', 'we', 1, 'each', 'other.'],
     ['Do', 'you', 'wish', 'to', 1, 'me', '?'],
     ['You', 'seem', 'to', 'need', 'to', 1, 'me.'],
     ['Do', 'you', 1, 'anyone', 'else', '?'],
   ]},
  {name: "i-28",
   contains: [['i']],
   responses: [
     ['You', 'say', 0, '?'],
     ['Can', 'you', 'elaborate', 'on', 'that', '?'],
     ['Do', 'you', 'say', 0, 'for', 'some', 'special', 'reason', '?'],
     ["That's", 'quite', 'interesting.'],
   ]},
  {name: "you",
   contains: [['you', 'remind', 'me', 'of']],
   responses: [
     ['In', 'what', 'way', '?'],
     ['What', 'resemblence', 'do', 'you', 'see', '?'],
     ['What', 'does', 'that', 'similarity', 'suggest', 'to', 'you', '?'],
     ['What', 'other', 'connections', 'do', 'you', 'see', '?'],
     ['What', 'do', 'you', 'suppose', 'that', 'resemblence', 'means', '?'],
     ['What', 'is', 'the', 'connection,', 'do', 'you', 'suppose', '?'],
     ['Could', 'here', 'really', 'be', 'some', 'connection', '?'],
     ['How', '?'],
   ]},
  {name: "you-1",
   contains: [['you', 'are']],
   responses: [
     ['What', 'makes', 'you', 'think', 'I', 'am', 1, '?'],
     ['Does', 'it', 'please', 'you', 'to', 'believe', 'I', 'am', 1, '?'],
     ['Do', 'you', 'sometimes', 'wish', 'you', 'were', 1, '?'],
     ['Perhaps', 'you', 'would', 'like', 'to', 'be', 1, '.'],
   ]},
  {name: "you-2",
   contains: [['you'], ['me']],
   responses: [
     ['Why', 'do', 'you', 'think', 'I', 1, 'you', '?'],
     ['You', 'like', 'to', 'think', 'I', 1, 'you', '--', "don't", 'you', '?'],
     ['What', 'makes', 'you', 'think', 'I', 1, 'you', '?'],
     ['Really,', 'I', 1, 'you', '?'],
     ['Do', 'you', 'wish', 'to', 'believe', 'I', 1, 'you', '?'],
     ['Suppose', 'I', 'did', 1, 'you', '--', 'what', 'would', 'that', 'mean', '?'],
     ['Does', 'someone', 'else', 'believe', 'I', 1, 'you', '?'],
   ]},
  {name: "you-3",
   contains: [['you']],
   responses: [
     ['We', 'were', 'discussing', 'you', '--', 'not', 'me.'],
     ['Oh,', 'I', 1, '?'],
     ["You're", 'not', 'really', 'talking', 'about', 'me', '--', 'are', 'you', '?'],
     ['What', 'are', 'your', 'feelings', 'now', '?'],
   ]},
  {name: "yes",
   contains: [['yes']],
   responses: [
     ['You', 'seem', 'to', 'be', 'quite', 'positive.'],
     ['You', 'are', 'sure.'],
     ['I', 'see.'],
     ['I', 'understand.'],
   ]},
  {name: "no",
   contains: [['no']],
   responses: [
     ['Are', 'you', 'saying', 'no', 'just', 'to', 'be', 'negative?'],
     ['You', 'are', 'being', 'a', 'bit', 'negative.'],
     ['Why', 'not', '?'],
     ['Why', "'no'", '?'],
   ]},
  {name: "can",
   contains: [['can', 'you']],
   responses: [
     ['You', 'believe', 'I', 'can', 1, "don't", 'you', '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
     ['You', 'want', 'me', 'to', 'be', 'able', 'to', 1, '.'],
     ['Perhaps', 'you', 'would', 'like', 'to', 'be', 'able', 'to', 1, 'yourself.'],
   ]},
  {name: "can-1",
   contains: [['can', 'i']],
   responses: [
     ['Whether', 'or', 'not', 'you', 'can', 1, 'depends', 'on', 'you', 'more', 'than', 'me.'],
     ['Do', 'you', 'want', 'to', 'be', 'able', 'to', 1, '?'],
     ['Perhaps', 'you', "don't", 'want', 'to', 1, '.'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "what",
   contains: [['what']],
   responses: [
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "because",
   contains: [['because']],
   responses: [
     ['Is', 'that', 'the', 'real', 'reason', '?'],
     ["Don't", 'any', 'other', 'reasons', 'come', 'to', 'mind', '?'],
     ['Does', 'that', 'reason', 'seem', 'to', 'explain', 'anything', 'else', '?'],
     ['What', 'other', 'reasons', 'might', 'there', 'be', '?'],
   ]},
  {name: "why",
   contains: [['why', "don't", 'you']],
   responses: [
     ['Do', 'you', 'believe', 'I', "don't", 1, '?'],
     ['Perhaps', 'I', 'will', 1, 'in', 'good', 'time.'],
     ['Should', 'you', 1, 'yourself', '?'],
     ['You', 'want', 'me', 'to', 1, '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "why-1",
   contains: [['why', "can't", 'i']],
   responses: [
     ['Do', 'you', 'think', 'you', 'should', 'be', 'able', 'to', 1, '?'],
     ['Do', 'you', 'want', 'to', 'be', 'able', 'to', 1, '?'],
     ['Do', 'you', 'believe', 'this', 'will', 'help', 'you', 'to', 1, '?'],
     ['Have', 'you', 'any', 'idea', 'why', 'you', "can't", 1, '?'],
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "why-2",
   contains: [['why']],
   responses: [
     ['Why', 'do', 'you', 'ask', '?'],
     ['Does', 'that', 'question', 'interest', 'you', '?'],
     ['What', 'is', 'it', 'you', 'really', 'wanted', 'to', 'know', '?'],
     ['Are', 'such', 'questions', 'much', 'on', 'your', 'mind', '?'],
     ['What', 'answer', 'would', 'please', 'you', 'most', '?'],
     ['What', 'do', 'you', 'think', '?'],
     ['What', 'comes', 'to', 'mind', 'when', 'you', 'ask', 'that', '?'],
     ['Have', 'you', 'asked', 'such', 'questions', 'before', '?'],
     ['Have', 'you', 'asked', 'anyone', 'else', '?'],
   ]},
  {name: "always",
   contains: [['always']],
   responses: [
     ['Can', 'you', 'think', 'of', 'a', 'specific', 'example', '?'],
     ['When', '?'],
     ['What', 'incident', 'are', 'you', 'thinking', 'of', '?'],
     ['Really,', 'always', '?'],
   ]},
];