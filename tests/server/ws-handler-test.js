//taken from https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/server/ws-handler-test.js

const request = require('supertest');
const {app} = require('../../src/server/app');
const WS = require('ws');

const {asyncCheckCondition} = require('../mytest-utils');
const {checkConnectedWS} = require('../mytest-utils-ws');

let server;
let port;

beforeAll(done => {

    server = app.listen(0, ()=> {
        port = server.address().port;
        done();
    });
});

afterAll(() => {
    server.close();
});


const sockets = [];

afterEach(() => {

    for(let i=0; i<sockets.length; i++){
        console.log("Closing socket: " + i);
        sockets[i].close();
    }
    sockets.length = 0;
});

test("Test counter update", async () =>{

    //register a client using WS
    const first = new WS('ws://localhost:' + port);
    sockets.push(first);

    let a = 0;
    first.on('message', data => {
        a = JSON.parse(data).userCount;
    });


    let connected = await checkConnectedWS(first, 2000);
    expect(connected).toBe(true);
    let updated = await asyncCheckCondition(() => {return a===1}, 2000, 200);
    expect(updated).toEqual(true);


    //then connect a second
    const second = new WS('ws://localhost:' + port);
    sockets.push(second);

    let b = 0;
    second.on('message', data => {
        b = JSON.parse(data).userCount;
    });


    connected = await checkConnectedWS(second, 2000);
    expect(connected).toBe(true);

    //both a and b should go up to 2
    updated = await asyncCheckCondition(() => {return a===2}, 2000, 200);
    expect(updated).toEqual(true);
    updated = await asyncCheckCondition(() => {return b===2}, 2000, 200);
    expect(updated).toEqual(true);

    //disconnect the second... value should go down in first
    second.terminate();
    updated = await asyncCheckCondition(() => {return a===1}, 2000, 200);
    expect(updated).toEqual(true);
});