import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { chat, save, resetTranscriptsForTesting, load } from './routes';


describe('routes', function() {

  it('chat', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {}});
    const res1 = httpMocks.createResponse();
    chat(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "message" was missing');

    // Second branch, straight line code
    const req2 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {message: "I hate computers."}});
    const res2 = httpMocks.createResponse();
    chat(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        {response: "Do computers worry you?"});

    const req3 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {message: "Are you alive"}});
    const res3 = httpMocks.createResponse();
    chat(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(),
        {response: "Why are you interested in whether I am alive or not?"});

  });

  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {replaced: false});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: true});

    resetTranscriptsForTesting();
  });

  it('load', function() {
    // First branch, straight line code, error case 
    const req1 = httpMocks.createRequest({method: 'GET', url: '/load',
    query: {}});
    const res1 = httpMocks.createResponse();
    load(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');
    
    //Second branch, straight line code, error case 
    const req2 = httpMocks.createRequest({method: 'GET', url: '/load',
    query: {name: "Hellooooo"}});
    const res2 = httpMocks.createResponse();
    load(req2, res2);
  
    assert.strictEqual(res2._getStatusCode(), 404);
    assert.deepStrictEqual(res2._getData(),
    'no transcript called "Hellooooo" was found');

    // Third branch, straight line code
    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: 'A', value: 'some stuff'}});
    const res3 = httpMocks.createResponse();
    const req4 = httpMocks.createRequest({method: 'GET', url: '/load',
    query: {name: 'A'}});
    const res4 = httpMocks.createResponse();

    save(req3, res3);
    load(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {value: 'some stuff'});
    
    resetTranscriptsForTesting();
  });

});
