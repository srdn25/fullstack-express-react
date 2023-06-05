const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../src/utils/consts');
const { prepareDate, convertToJSON } = require('../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket READ task', () => {
    const taskId = helper.generateId();
    const taskTitle = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(1));
    const taskStatus = TASK_STATUS.done;
    const notExistingTaskId = helper.generateId();
    const taskAuthor = 'Sam';

    before(async () => {
        await helper.addFixtures([
            {
                model: 'Task',
                data: [
                    {
                        id: taskId,
                        author: taskAuthor,
                        title: taskTitle,
                        status: taskStatus,
                        description: taskDescription,
                        dueDate: taskDueDate,
                    }
                ]
            }
        ])
    });

    it('Should be able to read task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Sam',
            method: WEBSOCKET_MESSAGE_METHODS.read,
            type: WEBSOCKET_MESSAGE_TYPES.send,
            id: taskId,
        });

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 2 messages - than close connection
            if (responseMessages.length >= 1) {
                client.close();
            }
        });

        // Send client message
        client.send(payloadMessage);

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                id: taskId,
                status: taskStatus,
                title: taskTitle,
                description: taskDescription,
                author: taskAuthor,
                dueDate: taskDueDate,
                createdAt: responseMessages[0].createdAt,
                updatedAt: responseMessages[0].updatedAt,
            },
        ]);
    });

    it('Should return error if task not found on read task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Sam',
            method: WEBSOCKET_MESSAGE_METHODS.read,
            type: WEBSOCKET_MESSAGE_TYPES.send,
            id: notExistingTaskId,
        });

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 2 messages - than close connection
            if (responseMessages.length >= 1) {
                client.close();
            }
        });

        // Send client message
        client.send(payloadMessage);

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                status: 404,
                message: 'Task not found',
            },
        ]);
    });
});