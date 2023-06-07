const WebSocket = require('ws');
const helper = require('../../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../../src/utils/consts');
const { convertToJSON, prepareDate } = require('../../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket SUBSCRIBE to update task', () => {
    const taskId1 = helper.generateId();
    const taskTitle1 = helper.generateText();
    const taskDescription1 = helper.generateText(false);
    const taskDueDate1 = prepareDate(helper.generateFutureDate(1));
    const taskAuthor1 = 'Squidward';
    const taskStatus1 = TASK_STATUS.inProgress;

    before(async () => {
        await helper.addFixtures([
            {
                model: 'Task',
                data: [
                    {
                        id: taskId1,
                        author: taskAuthor1,
                        title: taskTitle1,
                        description: taskDescription1,
                        dueDate: taskDueDate1,
                        status: taskStatus1,
                    },
                ]
            }
        ])
    });

    it('Should subscribe to update tasks by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payload = {
            status: TASK_STATUS.done,
            title: helper.generateText(),
        };

        const payloadMessage = JSON.stringify({
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.update,
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        });

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 3 messages - than close connection
            if (responseMessages.length >= 2) {
                client.close();
            }
        });

        // Send client message
        client.send(payloadMessage);

        await helper.app.db.Task.update(payload, {
            where: { id: taskId1 },
        });

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                method: WEBSOCKET_MESSAGE_METHODS.update,
                type: WEBSOCKET_MESSAGE_TYPES.subscribe,
                payload: {
                    status: 200,
                    message: 'Successfully subscribed',
                },
            },
            {
                method: WEBSOCKET_MESSAGE_METHODS.update,
                type: WEBSOCKET_MESSAGE_TYPES.subscribe,
                payload: {
                    id: taskId1,
                    title: payload.title,
                    status: payload.status,
                    author: taskAuthor1,
                    dueDate: taskDueDate1,
                    description: taskDescription1,
                    createdAt: responseMessages[1].payload.createdAt,
                    updatedAt: responseMessages[1].payload.updatedAt,
                },
            },
        ]);
    });
});