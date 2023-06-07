const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../src/utils/consts');
const { prepareDate, convertToJSON } = require('../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket DELETE task', () => {
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

    it('Should be able to delete task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        const taskFromDatabaseBeforeDelete = await helper.app.db.Task.findOne({ where: { id: taskId } });

        expect(!!taskFromDatabaseBeforeDelete).to.be.true;

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.delete,
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
                method: WEBSOCKET_MESSAGE_METHODS.delete,
                type: WEBSOCKET_MESSAGE_TYPES.send,
                payload: {
                    id: taskId,
                    status: 204,
                    message: 'Task deleted',
                },
            },
        ]);

        const taskFromDatabase = await helper.app.db.Task.findOne({ where: { id: taskId } });

        expect(!!taskFromDatabase).to.be.false;
    });

    it('Should return error if task not found on delete task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Akai',
            method: WEBSOCKET_MESSAGE_METHODS.delete,
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
                message: 'Not found task for delete',
            },
        ]);
    });
});