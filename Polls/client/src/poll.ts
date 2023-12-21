import { isRecord } from "./record";

export type Poll = {
    readonly name: string
    readonly options: string[],
    readonly votes: number[],
    readonly endTime: number,
    readonly peopleVoted: string[],
    readonly optionsWhichPeopleVoted: string[]
};

/** Parses unknown data into a Poll. Will log an error and return undefined
 * if it is not a valid Poll
 * @param val unknown data to parse into a Poll
 * @return Poll if val is a valid Poll and undefined otherwise
 */
export const parsePoll = (val: unknown): undefined | Poll => {
    if(!isRecord(val)) {
        console.error("not a poll", val);
        return undefined;
    }

    if (typeof val.name !== "string") {
        console.error("not a poll: missing 'name'", val);
        return undefined;
    }

    if (!Array.isArray(val.options)) {
        console.error("not a poll: missing 'options'", val);
        return undefined;
    }

    if (!Array.isArray(val.votes)) {
        console.error("not a poll: missing 'votes'", val);
        return undefined;
    }

    if (typeof val.endTime != "number" || val.endTime < 0 || isNaN(val.endTime)) {
        console.error("not a poll: missing or invalid 'endTime'", val);
        return undefined;
    }

    if (!Array.isArray(val.peopleVoted)) {
        console.error("not a poll: missing 'peopleVoted'", val);
        return undefined;
    }
    
    if (!Array.isArray(val.optionsWhichPeopleVoted)) {
        console.error("not a poll: missing 'optionsWhichPeopleVoted'", val);
        return undefined;
    }

    return {
        name: val.name, options: val.options, votes: val.votes, 
        endTime: val.endTime, peopleVoted: val.peopleVoted, optionsWhichPeopleVoted: val.optionsWhichPeopleVoted
    };
};