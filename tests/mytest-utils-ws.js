//taken from: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/mytest-utils-ws.js

const WS = require('ws');



export function checkConnectedWS(ws, timeoutMs){



    let id;

    const timedOut = new Promise(resolve => {

        id = setTimeout(() => resolve(false), timeoutMs);
    });

    const opened = new Promise(resolve => {
        ws.on('open', () => resolve(true));
    });


    return Promise.race([opened, timedOut])
        .then(result => {
            if(result) {
                //if WS was opened, and so result===resolve(true), then clear the timeout
                clearTimeout(id);
            }
            return result;
        });
}


export class WsStub extends WS{

    constructor(url){
        super(url);


        this.on('message', data => {
            if(this.onmessage) {
                this.onmessage({data});
            }
        });

        this.on('open', data => {
            if(this.onopen) {
                this.onopen({data});
            }
        });

        this.on('error', data => {
            if(this.onerror) {
                this.onerror({data});
            }
        });

        this.on('close', data => {
            if(this.onclose) {
                this.onclose({data});
            }
        });

        this.close = (code, reason) => {
            this.terminate();
        };

    }
}


export function overrideWebSocket(){
    global.WebSocket = WsStub;
}
