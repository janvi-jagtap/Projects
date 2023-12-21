import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy, load, names, resetFiles, save } from './routes';


describe('routes', function() {
  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function() {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}}); 
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    dummy(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), {greeting: 'Hi, Kevin'});
  });


  // TODO: add tests for your routes
  it ('save', function() {
    //Two inputs for when no file name is given, error case
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {value: 'some stuff'}}); 
      const res1 = httpMocks.createResponse();
      save(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 400);
      assert.deepEqual(res1._getData(), 'required argument "name" was missing');
    
      const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {value: 'other stuff'}}); 
      const res2 = httpMocks.createResponse();
      save(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 400);
      assert.deepEqual(res2._getData(), 'required argument "name" was missing');
    
    //Two cases for when no file content is given, error case
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'A'}}); 
      const res3 = httpMocks.createResponse();
      save(req3, res3);
      assert.strictEqual(res3._getStatusCode(), 400);
      assert.deepEqual(res3._getData(), 'required argument "value" was missing');   
    
      const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'B'}}); 
      const res4 = httpMocks.createResponse();
      save(req4, res4);
      assert.strictEqual(res3._getStatusCode(), 400);
      assert.deepEqual(res3._getData(), 'required argument "value" was missing');
    

    //Third branch a valid input, two inputs for two different files 
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'A', value: 'some stuff'}}); 
      const res5 = httpMocks.createResponse();
      save(req5, res5);
      assert.strictEqual(res5._getStatusCode(), 200);

    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'B', value: 'other stuff'}}); 
      const res6 = httpMocks.createResponse();
      save(req6, res6);
      assert.strictEqual(res6._getStatusCode(), 200);
    
    resetFiles();
  });

  it ('load', function() {
    //One input for when the name isn't given, error case
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {}}); 
      const res1 = httpMocks.createResponse();
      load(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 400);
      assert.deepEqual(res1._getData(), 'required argument "name" was missing');

    //Two inputs for when the file isn't saved previously, error case
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: 'Helooooooo'}}); 
      const res2 = httpMocks.createResponse();
      load(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 400);
      assert.deepEqual(res2._getData(), 'no file called "Helooooooo" was found');

    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: 'Stuff'}}); 
      const res3 = httpMocks.createResponse();
      load(req3, res3);
      assert.strictEqual(res3._getStatusCode(), 400);
      assert.deepEqual(res3._getData(), 'no file called "Stuff" was found');
    
    //Two inputs for when the file is loaded correctly
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/load', body: {name: 'A', value: 'some stuff'}}); 
      const res5 = httpMocks.createResponse();
      const req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'A'}}); 
        const res4 = httpMocks.createResponse();
        save(req5, res5);
        load(req4, res4);
      assert.strictEqual(res4._getStatusCode(), 200);
      assert.deepEqual(res4._getData(), {value: 'some stuff'});
    
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/load', body: {name: 'B', value: 'other stuff'}}); 
      const res6 = httpMocks.createResponse();
      const req7 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'B'}}); 
        const res7 = httpMocks.createResponse();
        save(req6, res6);
        load(req7, res7);
      assert.strictEqual(res7._getStatusCode(), 200);
      assert.deepEqual(res7._getData(), {value: 'other stuff'});

      resetFiles();
  });

  it ('names', function() {
    //One input when there are no files saved, error case
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/names'})
    const res1 = httpMocks.createResponse();
    names(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepEqual(res1._getData(), 'There are no files saved');

    // Straight line code only one input, retrieves all saved files if called
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'A', value: 'some stuff'}}); 
    const res5 = httpMocks.createResponse();
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'B', value: 'other stuff'}}); 
    const res6 = httpMocks.createResponse();
    save(req5, res5);
    save(req6, res6);
    const req2 = httpMocks.createRequest({method: 'GET', url: '/api/names'})
    const res2 = httpMocks.createResponse();

    const savedFiles: Map<string, unknown> = new Map<string, unknown>();
    savedFiles.set('A', 'some stuff');
    savedFiles.set('B', 'other stuff');
    
    names(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepEqual(res2._getData(), {value: Array.from(savedFiles.keys())});



    
      
  });

});
