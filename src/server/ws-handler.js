//taken from: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/ws-handler.js
//in case I were going to use websockets

const express_ws = require('express-ws');

let ews;

function init(app) {

    ews = express_ws(app);

    app.ws('/', function (socket, req) {
        console.log('Established a new WS connection');

        broadcastCount();

        //close is treated specially
        socket.on('close', () => {
            broadcastCount();
        });
    });
}

function broadcastCount() {
    const n = ews.getWss().clients.size;

    ews.getWss().clients.forEach((client) => {

        const data = JSON.stringify({userCount: n});

        client.send(data);
    });
}


module.exports = {init};