const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../src/utils/consts');
const { prepareDate, convertToJSON } = require('../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket READ task', () => {
    const taskId = helper.generateId();
    const taskId2 = helper.generateId();
    const taskTitle = helper.generateText();
    const taskTitle2 = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDescription2 = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(1));
    const taskDueDate2 = prepareDate(helper.generateFutureDate(1));
    const taskStatus = TASK_STATUS.done;
    const taskStatus2 = TASK_STATUS.todo;
    const notExistingTaskId = helper.generateId();
    const taskAuthor = 'Dean';
    const taskAuthor2 = 'Sam';

    beforeEach(async () => {
        await helper.clearDataInTable('Task');
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
                    },
                    {
                        id: taskId2,
                        author: taskAuthor2,
                        title: taskTitle2,
                        status: taskStatus2,
                        description: taskDescription2,
                        dueDate: taskDueDate2,
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
                method: WEBSOCKET_MESSAGE_METHODS.read,
                type: WEBSOCKET_MESSAGE_TYPES.send,
                payload: {
                    id: taskId,
                    status: taskStatus,
                    title: taskTitle,
                    description: taskDescription,
                    author: taskAuthor,
                    dueDate: taskDueDate,
                    createdAt: responseMessages[0].payload.createdAt,
                    updatedAt: responseMessages[0].payload.updatedAt,
                },
            },
        ]);
    });

    it('Should be get all tasks', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Sam',
            method: WEBSOCKET_MESSAGE_METHODS.read,
            type: WEBSOCKET_MESSAGE_TYPES.send,
            where: '*',
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

        const expectedPayload = [ {
            id: taskId,
            status: taskStatus,
            title: taskTitle,
            description: taskDescription,
            author: taskAuthor,
            dueDate: taskDueDate,
            createdAt: responseMessages[0].payload[0].createdAt,
            updatedAt: responseMessages[0].payload[0].updatedAt,
        },
        {
            id: taskId2,
            author: taskAuthor2,
            title: taskTitle2,
            status: taskStatus2,
            description: taskDescription2,
            dueDate: taskDueDate2,
            createdAt: responseMessages[0].payload[1].createdAt,
            updatedAt: responseMessages[0].payload[1].updatedAt,
        } ].sort((a, b) => a.id > b.id ? 1 : -1);

        expect(responseMessages).to.be.eql([{
            type: WEBSOCKET_MESSAGE_TYPES.send,
            method: WEBSOCKET_MESSAGE_METHODS.read,
            payload: expectedPayload,
        }]);
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