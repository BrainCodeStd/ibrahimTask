//taken from: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/mytest-utils.js

const request = require('supertest');


export function stubFetch(
    // http status to return, eg 200
    status,
    //the json payload
    payload,
    // an optional function that checks if the inputs in "fetch(url, init)" are valid
    predicate) {

    //define fetch method at global level, as it is not available on NodeJS
    global.fetch = (url, init) => {

        //if defined, crash if the predicate is not satisfied
        if(predicate) {
            predicate(url, init);
        }

        return new Promise((resolve, reject) => {

            const httpResponse = {
                status: status,
                json: () => {return new Promise(
                    (res, rej) => {res(payload);}
                )}
            };

            resolve(httpResponse);
        });
    };
}

/*
    Override fetch() to make calls to the backend using SuperTest
 */
export function overrideFetch(app){

    const agent = request.agent(app);

    global.fetch = async (url, init) => {

        let response;

        if(!init || !init.method || init.method.toUpperCase() === "GET"){
            response = await agent.get(url);
        } else if(init.method.toUpperCase() === "POST"){
            response = await agent.post(url)
                .send(init.body)
                .set('Content-Type', init.headers ? init.headers['Content-Type'] : "application/json");
        } else if(init.method.toUpperCase() === "PUT"){
            response = await agent.put(url)
                .send(init.body)
                .set('Content-Type', init.headers ? init.headers['Content-Type'] : "application/json");
        } else if(init.method.toUpperCase() === "DELETE"){
            response = await agent.delete(url);
        } else {
            throw "Unhandled HTTP method: " + init.method;
        }

        const payload = response.body;

        return new Promise( (resolve, reject) => {

            const httpResponse = {
                status: response.statusCode,
                json: () => {return new Promise(
                    (res, rej) => {res(payload);}
                )}
            };

            resolve(httpResponse);
        });
    };
}


export function asyncCheckCondition(predicate, totalTimeMS, intervalMS){

    const start = Date.now();

    return new Promise((resolve) => {
        recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve);
    });
}

export function recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve){
    const elapsed = Date.now() - start;
    if(elapsed > totalTimeMS){
        resolve(false);
    } else if(predicate()){
        resolve(true);
    } else {
        setTimeout(() => {
            recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve);
        }, intervalMS);
    }
}

export function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}





