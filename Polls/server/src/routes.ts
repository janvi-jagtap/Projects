import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// TODO: remove the dummy route

type Poll = {
  name: string,
  options: string[],
  votes: number[],
  endTime: number,
  peopleVoted: string[]
  optionsWhichPeopleVoted: string[]
};

const polls: Map<string, Poll> = new Map();

/** Testing function to move all end times forward the given amount (of ms). */
export const advanceTimeForTesting = (ms: number): void => {
  for (const auction of polls.values()) {
    auction.endTime -= ms;
  }
}

/** Sorts the ongoing poll in increasing remaining time */
const comparePolls = (a: Poll, b: Poll): number => {
  const now: number = Date.now();
  const endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
  const endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
  return endA - endB;

}

/** Gets a list of all the ongoing polls in sorted order in increasing remaining time left
 * @param: _req the request
 * @param res the response
  */
export const listPolls = ( _req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(polls.values());
  vals.sort(comparePolls);
  res.send({values: vals});
}

/** Retrieves an ongoing poll if given a name
 * @param req the request
 * @param res the response
 */
export const getPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.query.name;
  if (typeof name != "string") {
    res.status(400).send("missing or invalid 'name parameter");
    return;
  }
  if (!polls.has(name)) {
    res.status(400).send(`no poll with name '${name}'`);
    return;
  }
  res.send({values: polls.get(name)});
}

/** Creates a new poll and adds it to the list of ongoing polls
 * @param req the request
 * @param res the response
 */
export const addPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("mising or invalid 'name' parameter");
    return;
  }

  const pollContent = req.body.options;
  if (!Array.isArray(pollContent)) {
    res.status(400).send("missing or invalid 'option' parameter");
    return;
  }
  else if (pollContent.length < 2) {
    res.status(400).send("You must have at least 2 items in your poll");
    return;
  }

  const minutes = req.body.minutes;
  if (typeof minutes != "number") {
    res.status(400).send(`'minutes' is not a number: ${minutes}`);
    return;
  }
  else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) != minutes) {
    res.status(400).send(`'minutes' is not a positive integer: ${minutes}`);
    return;
  }

  if (polls.has(name)) {
    res.status(400).send(`poll for '${name}' already exists`);
    return;
  }

  const options: string[] = [];
  const votes: number[] = [];
  for (let item of pollContent) {
    options.push(item);
    votes.push(0);
  }

  const poll: Poll = {
    name: name,
    options: options,
    votes: votes,
    endTime: Date.now() + minutes * 60 * 1000,
    peopleVoted: [],
    optionsWhichPeopleVoted: []
  };

  polls.set(name, poll);
  res.send({value: true});
}

/** Allows the user to vote in the poll
 * @param req the request
 * @param res the response
 */
export const vote = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name; 
  if (typeof name !== "string") {
    res.status(400).send("missing or invalid 'name' parameter");
    return;
  }

  const poll = polls.get(name);
  if (poll === undefined) {
    res.status(400).send(`no poll with name '${name}'`);
    return;
  }

  const now = Date.now();
  if (now >= poll.endTime) {
    res.status(400).send(`the poll '${name}' has already ended`);
    return;
  }

  const person = req.body.person;
  if (typeof person !== "string") {
    res.status(400).send("missing or invalid 'person' parameter");
    return;
  }
  
  const option = req.body.option;
  if (typeof option !== "string") {
    res.status(400).send("missing or invalid 'option' parameter");
    return;
  }
  if (!poll.options.includes(option)) {
    res.status(400).send("this option isn't a part of this poll");
    return;
  }

  if (poll.peopleVoted.includes(person)) {
    const index = poll.peopleVoted.indexOf(person);
    const oldChoice = poll.optionsWhichPeopleVoted[index];
    const optionIndex = poll.options.indexOf(oldChoice);
    const oldVote = poll.votes[optionIndex];
    poll.votes[optionIndex] = oldVote - 1;
    const newOptionIndex = poll.options.indexOf(option);
    const num = poll.votes[newOptionIndex];
    poll.votes[newOptionIndex] = num + 1;
    poll.optionsWhichPeopleVoted[index] = option;
  }
  else {
    const index = poll.options.indexOf(option);
    const num = poll.votes[index];
    poll.votes[index] = num + 1;
    poll.peopleVoted.push(person);
    poll.optionsWhichPeopleVoted.push(option);
  }

  res.send({value: true});
}




