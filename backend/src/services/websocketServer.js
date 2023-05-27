const { WebSocketServer } = require('ws');
const PubSub = require('./pubSub');

module.exports = (httpServer, logger) => {
    const ws = new WebSocketServer({ server: httpServer });
    const pubSub = new PubSub({ logger });

    ws.on('connection', () => {
        ws.send('Welcome, you are connected!');

        ws.on('error', (error) => logger.error({
            message: 'Webhook client connection error',
            error,
        }));
        ws.on('message', function message(data) {
            // TODO: parse message - add method for CRUD task
            logger.debug(`WS received message: ${data}`);
        });
        ws.on('close', () => {
            console.log('The client has connected');
        });
    });

    ws.on('error', (error) => logger.error({
        message: 'Webhook server error',
        error,
    }));

    return ws;
};