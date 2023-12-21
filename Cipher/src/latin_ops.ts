import { explode, compact } from './char_list';
import { List, cons, nil, concat, rev, len } from './list';
import { prefix, suffix, last } from './list_ops';

/** Determines whether the given character is a vowel. */
const is_latin_vowel = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "aeiouy".indexOf(ch) >= 0;
};

/** Determines whether the given character is a Latin consonant. */
const is_latin_consonant = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "bcdfghjklmnpqrstvwxz".indexOf(ch) >= 0;
};

/** Changes most Latin alphabetic characters to different ones. */
export const next_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "e".charCodeAt(0);
        case "e": return "i".charCodeAt(0);
        case "i": return "o".charCodeAt(0);
        case "o": return "u".charCodeAt(0);
        case "u": return "y".charCodeAt(0);
        case "y": return "a".charCodeAt(0);

        case "b": return "p".charCodeAt(0);
        case "p": return "j".charCodeAt(0);
        case "j": return "g".charCodeAt(0);
        case "g": return "d".charCodeAt(0);
        case "d": return "t".charCodeAt(0);
        case "t": return "b".charCodeAt(0);

        case "c": return "k".charCodeAt(0);
        case "k": return "s".charCodeAt(0);
        case "s": return "z".charCodeAt(0);
        case "z": return "c".charCodeAt(0);

        case "f": return "v".charCodeAt(0);
        case "v": return "w".charCodeAt(0);
        case "w": return "f".charCodeAt(0);

        case "h": return "l".charCodeAt(0);
        case "l": return "r".charCodeAt(0);
        case "r": return "h".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

/** Inverse of next_char. */
export const prev_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "y".charCodeAt(0);
        case "e": return "a".charCodeAt(0);
        case "i": return "e".charCodeAt(0);
        case "o": return "i".charCodeAt(0);
        case "u": return "o".charCodeAt(0);
        case "y": return "u".charCodeAt(0);

        case "b": return "t".charCodeAt(0);
        case "p": return "b".charCodeAt(0);
        case "j": return "p".charCodeAt(0);
        case "g": return "j".charCodeAt(0);
        case "d": return "g".charCodeAt(0);
        case "t": return "d".charCodeAt(0);

        case "c": return "z".charCodeAt(0);
        case "k": return "c".charCodeAt(0);
        case "s": return "k".charCodeAt(0);
        case "z": return "s".charCodeAt(0);

        case "f": return "w".charCodeAt(0);
        case "v": return "f".charCodeAt(0);
        case "w": return "v".charCodeAt(0);

        case "h": return "r".charCodeAt(0);
        case "l": return "h".charCodeAt(0);
        case "r": return "l".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

// Note: count_consonants() and AY are provided to help you implement
// pig_latin_encode and pig_latin_decode

/** Returns the number of consonants at the start of the given string */
export const count_consonants = (L: List<number>): number|undefined => {
    if (L === nil) {
        return undefined;
    } else if (is_latin_vowel(L.hd)) {
        return 0;
    } else if (is_latin_consonant(L.hd)) {
        const n = count_consonants(L.tl);
        if (n === undefined) {
            return undefined;
        } else {
            return n + 1;
        }
    } else {
        return undefined;
    }
};

// TODO: uncomment to use
// List containing the character codes for the string "AY".
const AY: List<number> = cons("a".charCodeAt(0), cons("y".charCodeAt(0), nil));
const WAY: List<number> = cons("w".charCodeAt(0), cons("a".charCodeAt(0), explode("y")));


// TODO: add your function declarations in this file for: 
// cipher_encode, cipher_decode crazy_caps_encode, crazy_caps_decode,
// pig_latin_encode, pig_latin_decode

/** Translates pig-latin word back to english */
export const pig_latin_decode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else if (len(L) === 1) {
        return L;
    }
    else if (compact(prefix(2, rev(L))) !== compact(rev(AY))) {
        return L;
    }

    const consonants: undefined|number = count_consonants(suffix(2, rev(L)));
    if (consonants === undefined) {
        return L;
    }
    else if (consonants === 0) {
        const s: List<number> = suffix(3, rev(L));
        if (last(prefix(3, rev(L))) === "u".charCodeAt(0) && s !== nil) {
            if (s.hd === "q".charCodeAt(0)) {
                const c: undefined|number = count_consonants(s.tl);
                if (c === undefined || c === 0) {
                    return concat(cons("q".charCodeAt(0), explode("u")), rev(s.tl));
                }
                else {
                    return concat(concat(rev(prefix(c, s.tl)), cons("q".charCodeAt(0), explode("u"))), rev(suffix(c, s.tl)));
                }
            }
        }
        return L;
    }
    else if (consonants === 1 && last(prefix(2 + consonants, rev(L))) === "w".charCodeAt(0)) {
        return rev(suffix(2 + consonants, rev(L)));
    }
    else {
        return concat(rev(suffix(2, prefix(2 + consonants, rev(L)))), rev(suffix(2 + consonants, rev(L))));
    }
};

/** Translates word into pig-latin */
export const pig_latin_encode = (L: List<number>): List <number> => {
    const consonants: undefined|number = count_consonants(L);
    if (L === nil) {
        return nil;
    }
    else if (consonants === undefined) {
        return L;
    }
    else if (consonants === 0){
        return cons(L.hd, concat(L.tl, WAY));
    }
    else {
        const suf: List<number> = suffix(consonants, L);
        const pre: List<number> = prefix(consonants, L);
        if (suf !== nil) {
            if (last(pre) === "q".charCodeAt(0) && suf.hd === "u".charCodeAt(0) && count_consonants(suf.tl) === 0) {
                return concat(concat(suffix(consonants + 1, L), prefix(consonants + 1, L)), AY);
            }
        }
        return concat(concat(suf, pre), AY);
    }
};

/** Replaces each character by the next Latin character */
export const cipher_encode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else {
        return cons(next_latin_char(L.hd), cipher_encode(L.tl));
    }
};

/** Replaces each character by the previous Latin character */
export const cipher_decode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else {
        return cons(prev_latin_char(L.hd), cipher_decode(L.tl));
    }
};

/** Turns every other letter starting with the first into uppercase */
export const crazy_caps_encode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else {
        const upperCaseLetter: String = String.fromCharCode(L.hd).toUpperCase();
        const upperCaseNum: number = upperCaseLetter.charCodeAt(0);
        return cons(upperCaseNum, helper(L.tl));
    }
};

const helper = (L: List<number>): List<number> => {
    if (L == nil) {
        return nil;
    }
    else {
        return cons(L.hd, crazy_caps_encode(L.tl));
    }
};

/** Turns every other letter starting with the first into lowercase */
export const crazy_caps_decode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else {
        const lowerCaseLetter: String = String.fromCharCode(L.hd).toLowerCase();
        const lowerCaseNum: number = lowerCaseLetter.charCodeAt(0);
        return cons(lowerCaseNum, helper2(L.tl));
    }
};

const helper2 = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }
    else {
        return cons(L.hd, crazy_caps_decode(L.tl));
    }
};
