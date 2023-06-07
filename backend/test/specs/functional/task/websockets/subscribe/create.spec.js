const WebSocket = require('ws');
const helper = require('../../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../../src/utils/consts');
const { convertToJSON } = require('../../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket SUBSCRIBE to create task', () => {
    it('Should subscribe to create tasks by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'SpongeBob',
            method: WEBSOCKET_MESSAGE_METHODS.create,
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        });

        const responseMessages = [];
        const createdTasks = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 5 messages - than close connection
            if (responseMessages.length >= 4) {
                client.close();
            }
        });

        // Send client message
        client.send(payloadMessage);

        // create 3 tasks for check database trigger
        for (let i = 0; i < 3 ;i ++) {
            const payload = await helper.createTask();
            createdTasks.push({
                method: WEBSOCKET_MESSAGE_METHODS.create,
                type: WEBSOCKET_MESSAGE_TYPES.subscribe,
                payload,
            });
        }

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                method: WEBSOCKET_MESSAGE_METHODS.create,
                type: WEBSOCKET_MESSAGE_TYPES.subscribe,
                payload: {
                    status: 200,
                    message: 'Successfully subscribed',
                },
            },
            ...createdTasks,
        ]);
    });
});