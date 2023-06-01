const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES } = require('../../../../../src/utils/consts');
const { prepareDate } = require('../../../../../src/utils');

const { expect, assert } = helper;

describe.skip('[FUNCTIONAL] websocket create task', () => {
    it('Should be able create task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);
        const payload = {
            user: 'Patric',
            method: 'create',
            type: WEBSOCKET_MESSAGE_TYPES.send,
            dueDate: prepareDate(helper.generateFutureDate(15)),
            title: helper.generateText(),
            description: helper.generateText(false),
            author: 'Patric',
        };

        const payloadMessage = JSON.stringify(payload);

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(data.toString());
        });

        // Send client message
        client.send(payloadMessage);

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql(['pong']);
        assert.calledOnce(helper.app.logger.debug);
        assert.calledWith(helper.app.logger.debug, `WS received message: ${payloadMessage}`);
    });
});