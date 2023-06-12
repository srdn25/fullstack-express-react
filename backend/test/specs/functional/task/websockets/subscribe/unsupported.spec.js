const WebSocket = require('ws');
const helper = require('../../../../helper');
const { WEBSOCKET_MESSAGE_METHODS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../../../src/utils/consts');
const { convertToJSON } = require('../../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket SUBSCRIBE to unsupported methods for task', () => {
    it('Send error if try to subscribe for read method', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = {
            method: WEBSOCKET_MESSAGE_METHODS.read,
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        };

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 2 messages - than close connection
            if (responseMessages.length >= 1) {
                client.close();
            }
        });

        // Send client message
        client.send(JSON.stringify(payloadMessage));

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                status: 400,
                message: `No make sense subscribe to this method - ${payloadMessage.method}`,
            },
        ]);
    });

    it('Send error if try to subscribe for not supported method', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = {
            method: 'patch',
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        };

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 2 messages - than close connection
            if (responseMessages.length >= 1) {
                client.close();
            }
        });

        // Send client message
        client.send(JSON.stringify(payloadMessage));

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                status: 400,
                message: `Not allowed message method - ${payloadMessage.method}`,
            },
        ]);
    });
})