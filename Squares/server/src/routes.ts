import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

//The saved files
const savedFiles: Map<string, unknown> = new Map<string, unknown>();

/** Returns a list of all the named save files. */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({greeting: `Hi, ${name}`});
};

/** Saves the given file and it's content */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const fileName = req.body.name;
  if (fileName === undefined || typeof fileName !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  const fileContent = req.body.value;
  if (fileContent === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  if (typeof fileName === 'string') {
    savedFiles.set(fileName, fileContent);
    res.send({value: true});
  }
};

/** Retrieves the file that's asked for */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const file = first(req.query.name);
  if (file === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  else if (!savedFiles.has(file)) {
    res.status(400).send(`no file called "${file}" was found`);
    return;
  }
  else {
    res.send({value: savedFiles.get(file)});
  }
};

/** Gives the list of all the files saved */
export const names =  (_req: SafeRequest, res: SafeResponse): void => {
  if (savedFiles.size === 0) {
    res.status(400).send('There are no files saved');
  }
  else {
    res.send({value: Array.from(savedFiles.keys())});
  }
};

/** Resets the saved files back to empty, only used in testing */
export const resetFiles = (): void => {
  savedFiles.clear();
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
