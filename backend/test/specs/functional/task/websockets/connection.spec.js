const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES } = require('../../../../../src/utils/consts');

const { expect, assert } = helper;

describe('websocket connection', () => {
    it('On start application should create websocket server', () => {
        expect(helper.app).to.have.property('callbackList');
        expect(helper.app).to.have.property('pubsub');
        expect(helper.app).to.have.property('websocket');
    });

    it('Websocket server should retrieve message from client', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        helper.sandbox.spy(helper.app.logger, 'debug');

        await helper.waitForSocketState(client, client.OPEN);

        const testMessage = JSON.stringify({
            user: 'SpongeBob',
            method: 'create',
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        });

        let responseMessage;

        client.on('connection', (data) => {
            console.log(data);
        });

        client.on('error', console.error);

        client.on('message', (data) => {
            responseMessage = data.toString();
            // Close the client after received response
            client.close();
        });

        // Send client message
        client.send(testMessage);

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessage).to.be.eql('pong');
        assert.calledOnce(helper.app.logger.debug);
        assert.calledWith(helper.app.logger.debug, `WS received message: ${testMessage}`);
    })
});