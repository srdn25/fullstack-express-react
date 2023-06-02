const { WebSocketServer } = require('ws');
const WebsocketMessageHandler = require('../requestHandlers/actions/task/websockets/MessageHandler');
const { convertToJSON } = require('../utils');

module.exports = (app) => {
    const wss = new WebSocketServer({ port: app.config.WEBSOCKET_PORT });

    wss.on('connection', (ws) => {
        ws.send('Welcome, you are connected!');
        const messageHandler = new WebsocketMessageHandler({ app, send: ws.send });

        ws.on('error', (error) => app.logger.error({
            message: 'Websocket client connection error',
            error,
        }));

        ws.on('message', async function message(data) {
            app.logger.debug(`WS received message: ${data}`);

            try {
                const json = convertToJSON(data, true);
                messageHandler.validateMessage(json);
                messageHandler.authenticate()
                const response = await messageHandler.handle(json);

                ws.send(JSON.stringify(response));
            } catch (error) {
                const message = error.message || 'Websocket error on working message handler';

                ws.send(JSON.stringify({
                    message,
                    status: error.status || 400,
                }));

                app.logger.error({
                    message,
                    error,
                });
            }

            ws.send('pong');
        });

        ws.on('close', () => {
            messageHandler.disconnect();
            console.log('The client has connected');
        });
    });

    wss.on('error', (error) => app.logger.error({
        message: 'Websocket server error',
        error,
    }));

    return wss;
};