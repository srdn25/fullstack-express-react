const { WebSocketServer } = require('ws');

module.exports = (app) => {
    const ws = new WebSocketServer({ server: app.httpServer });

    ws.on('connection', () => {
        ws.send('Welcome, you are connected!');
        const messageHandler = new WebhookMessageHandler(app, ws.send);

        ws.on('error', (error) => app.logger.error({
            message: 'Webhook client connection error',
            error,
        }));

        ws.on('message', async function message(data) {
            app.logger.debug(`WS received message: ${data}`);

            try {
                messageHandler.validateMessage(data);
                messageHandler.authenticate()
                await messageHandler.handle(data);
            } catch (error) {
                throw new app.TransportError({
                    status: error.status || 400,
                    message: error.message || 'Webhooks error on working message handler',
                    error,
                })
            }
        });

        ws.on('close', () => {
            messageHandler.disconnect();
            console.log('The client has connected');
        });
    });

    ws.on('error', (error) => app.logger.error({
        message: 'Webhook server error',
        error,
    }));

    return ws;
};