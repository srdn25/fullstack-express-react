const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../src/utils/consts');
const { prepareDate, convertToJSON } = require('../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket UPDATE task', () => {
    const taskId = helper.generateId();
    const taskTitle = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(3));
    const taskStatus = TASK_STATUS.inProgress;
    const notExistingTaskId = helper.generateId();
    const taskAuthor = 'Bob';

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

    it('Should be able to update task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payload = {
            dueDate: prepareDate(helper.generateFutureDate(9)),
            description: helper.generateText(false),
            author: 'Michael',
        };

        const payloadMessage = JSON.stringify({
            ...payload,
            user: 'Dean',
            method: WEBSOCKET_MESSAGE_METHODS.update,
            type: WEBSOCKET_MESSAGE_TYPES.send,
            taskId,
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
                method: WEBSOCKET_MESSAGE_METHODS.update,
                type: WEBSOCKET_MESSAGE_TYPES.send,
                payload: {
                    id: taskId,
                    status: taskStatus,
                    title: taskTitle,
                    description: payload.description,
                    author: payload.author,
                    dueDate: payload.dueDate,
                    createdAt: responseMessages[0].payload.createdAt,
                    updatedAt: responseMessages[0].payload.updatedAt,
                },
            },
        ]);
    });
});