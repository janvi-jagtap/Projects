import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addPoll, advanceTimeForTesting, getPoll, listPolls, vote } from './routes';


describe('routes', function() {



  it ('add', function(){

    //Missing name
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {}});
    const res1 = httpMocks.createResponse();
    addPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "mising or invalid 'name' parameter");

    //Missing poll content
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner"}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        "missing or invalid 'option' parameter");

    // Two inputs for when poll content has less than 2 options
    const option1: string[] = ["hi"];
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option1}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        "You must have at least 2 items in your poll");

       const option2: string[] = []
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option2}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
        "You must have at least 2 items in your poll");

    //Missing minutes
    const option3: string[] = ["hi", "dog"]
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option3}});
    const res5 = httpMocks.createResponse();
    addPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        "'minutes' is not a number: undefined");

    //Two inputs for when minutes is not a valid number
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option3, minutes: 0}});
    const res6 = httpMocks.createResponse();
    addPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        "'minutes' is not a positive integer: 0");

    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option3, minutes: 5.3}});
    const res7 = httpMocks.createResponse();
    addPoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        "'minutes' is not a positive integer: 5.3");
    
    //Two tests for correctly added
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: option3, minutes: 5}});
    const res8 = httpMocks.createResponse();
    addPoll(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);

    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "lunch", options: ["chipotle", "burrito"], minutes: 7}});
    const res9 = httpMocks.createResponse();
    addPoll(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    

    //poll name already exists (two inputs)
    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "dinner", options: ["a", "b", "c"], minutes: 10}});
    const res10 = httpMocks.createResponse();
    addPoll(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(),
    "poll for 'dinner' already exists");

    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "lunch", options: ["d", "e", "f"], minutes: 10}});
    const res11 = httpMocks.createResponse();
    addPoll(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(),
    "poll for 'lunch' already exists");

  })

it ('get', function(){
    //name is missing
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {}});
    const res1 = httpMocks.createResponse();
    getPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing or invalid 'name parameter");

    //name of that poll doesn't exist (two inputs)
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "breakfast"}});
    const res2 = httpMocks.createResponse();
    getPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "no poll with name 'breakfast'");

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "snack"}});
    const res3 = httpMocks.createResponse();
    getPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "no poll with name 'snack'");

    //Two inputs for when it correctly gets the poll
    const req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "dinner"}});
    const res4 = httpMocks.createResponse();
    getPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.strictEqual(res4._getData().values.name, "dinner");
    assert.deepStrictEqual(res4._getData().values.options, ["hi", "dog"]);
    assert.deepStrictEqual(res4._getData().values.votes, [0, 0]);
    assert.deepStrictEqual(res4._getData().values.peopleVoted, []);
    assert.deepStrictEqual(res4._getData().values.optionsWhichPeopleVoted, []);

    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "lunch"}});
    const res5 = httpMocks.createResponse();
    getPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.strictEqual(res5._getData().values.name, "lunch");
    assert.deepStrictEqual(res5._getData().values.options, ["chipotle", "burrito"]);
    assert.deepStrictEqual(res5._getData().values.votes, [0, 0]);
    assert.deepStrictEqual(res5._getData().values.peopleVoted, []);
    assert.deepStrictEqual(res5._getData().values.optionsWhichPeopleVoted, []);
})

it ('vote', function(){

    //name is missing
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {}});
    const res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "missing or invalid 'name' parameter");

   // Poll wasn't ever created (two inputs)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "snack"}});
    const res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        "no poll with name 'snack'");
    
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "breakfast"}});
    const res3 = httpMocks.createResponse();
    vote(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        "no poll with name 'breakfast'");
    
    //The name of the voter is missing
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch"}});
    const res6 = httpMocks.createResponse();
    vote(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        "missing or invalid 'person' parameter");

     //No option was chosen
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch", person: "Lisa"}});
    const res7 = httpMocks.createResponse();
    vote(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        "missing or invalid 'option' parameter");
    
    //An option that wasn't a part of the poll was chosen (two inputs)
    const req16 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch", person: "Lisa", option: "qdoba"}});
    const res16 = httpMocks.createResponse();
    vote(req16, res16);
    assert.strictEqual(res16._getStatusCode(), 400);
    assert.deepStrictEqual(res16._getData(),
    "this option isn't a part of this poll");

    const req17 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "dinner", person: "Ramona", option: "burgersss"}});
    const res17 = httpMocks.createResponse();
    vote(req17, res17);
    assert.strictEqual(res17._getStatusCode(), 400);
    assert.deepStrictEqual(res17._getData(),
    "this option isn't a part of this poll");
    
    //Correctly adds the vote when the person voting hasn't already voted (two inputs)
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch", person: "Lisa", option: "chipotle"}});
    const res8 = httpMocks.createResponse();
    vote(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);

    const req9 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "lunch"}});
    const res9 = httpMocks.createResponse();
    getPoll(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.strictEqual(res9._getData().values.name, "lunch");
    assert.deepStrictEqual(res9._getData().values.options, ["chipotle", "burrito"]);
    assert.deepStrictEqual(res9._getData().values.votes, [1, 0]);
    assert.deepStrictEqual(res9._getData().values.peopleVoted, ["Lisa"]);
    assert.deepStrictEqual(res9._getData().values.optionsWhichPeopleVoted, ["chipotle"]);

    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "dinner", person: "Michelle", option: "dog"}});
    const res10 = httpMocks.createResponse();
    vote(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);

    const req11 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "dinner"}});
    const res11 = httpMocks.createResponse();
    getPoll(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 200);
    assert.strictEqual(res11._getData().values.name, "dinner");
    assert.deepStrictEqual(res11._getData().values.options, ["hi", "dog"]);
    assert.deepStrictEqual(res11._getData().values.votes, [0, 1]);
    assert.deepStrictEqual(res11._getData().values.peopleVoted, ["Michelle"]);
    assert.deepStrictEqual(res11._getData().values.optionsWhichPeopleVoted, ["dog"]);
    
    //Correctly adds the vote when the person has already voted (two inputs)
    const req12 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch", person: "Lisa", option: "burrito"}});
    const res12 = httpMocks.createResponse();
    vote(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 200);
    
    const req13 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "lunch"}});
    const res13 = httpMocks.createResponse();
    getPoll(req13, res13);
    assert.strictEqual(res13._getStatusCode(), 200);
    assert.strictEqual(res13._getData().values.name, "lunch");
    assert.deepStrictEqual(res13._getData().values.options, ["chipotle", "burrito"]);
    assert.deepStrictEqual(res13._getData().values.votes, [0, 1]);
    assert.deepStrictEqual(res13._getData().values.peopleVoted, ["Lisa"]);
    assert.deepStrictEqual(res13._getData().values.optionsWhichPeopleVoted, ["burrito"]);

    const req14 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "dinner", person: "Michelle", option: "hi"}});
    const res14 = httpMocks.createResponse();
    vote(req14, res14);
    assert.strictEqual(res10._getStatusCode(), 200);

    const req15 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "dinner"}});
    const res15 = httpMocks.createResponse();
    getPoll(req15, res15);
    assert.strictEqual(res15._getStatusCode(), 200);
    assert.strictEqual(res15._getData().values.name, "dinner");
    assert.deepStrictEqual(res15._getData().values.options, ["hi", "dog"]);
    assert.deepStrictEqual(res15._getData().values.votes, [1, 0]);
    assert.deepStrictEqual(res15._getData().values.peopleVoted, ["Michelle"]);
    assert.deepStrictEqual(res15._getData().values.optionsWhichPeopleVoted, ["hi"]);

    advanceTimeForTesting(2000000000000);

    //The poll you're trying to vote on has already ended (two inputs)
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "lunch"}});
    const res4 = httpMocks.createResponse();
    vote(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
        "the poll 'lunch' has already ended");
    
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "dinner"}});
    const res5 = httpMocks.createResponse();
    vote(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        "the poll 'dinner' has already ended");

})

it ('list', function(){

    //Gets the list of all the polls that have been added so far with most recent first (two inputs)
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
    const res1 = httpMocks.createResponse();
    listPolls(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().values[0].name, "lunch");
    assert.deepStrictEqual(res1._getData().values[1].name, "dinner");

    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "breakfast", options: ["eggs", "toast", "coffee"], minutes: 5}});
    const res8 = httpMocks.createResponse();
    addPoll(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
    const res2 = httpMocks.createResponse();
    listPolls(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData().values[0].name, "breakfast");
    assert.deepStrictEqual(res2._getData().values[1].name, "lunch");
    assert.deepStrictEqual(res2._getData().values[2].name, "dinner");
    
});

});
