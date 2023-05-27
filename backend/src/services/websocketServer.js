const { WebSocketServer } = require('ws');
const WebsocketMessageHandler = require('../actions/task/websockets/MessageHandler');

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
                const json = JSON.parse(data);
                messageHandler.validateMessage(json);
                messageHandler.authenticate()
                await messageHandler.handle(json);
            } catch (error) {
                const message = error.message || 'Websocket error on working message handler';

                ws.send(JSON.stringify({
                    message,
                    status: 400,
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