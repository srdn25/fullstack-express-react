const WebSocket = require('ws');
const helper = require('../../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../../src/utils/consts');
const { convertToJSON, prepareDate } = require('../../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket SUBSCRIBE to delete task', () => {
    const taskId1 = helper.generateId();
    const taskId2 = helper.generateId();
    const taskTitle1 = helper.generateText();
    const taskTitle2 = helper.generateText();
    const taskDescription1 = helper.generateText(false);
    const taskDescription2 = helper.generateText(false);
    const taskDueDate1 = prepareDate(helper.generateFutureDate(1));
    const taskDueDate2 = prepareDate(helper.generateFutureDate(1));
    const taskAuthor1 = 'Sandy Cheeks';
    const taskAuthor2 = 'Patric';
    const taskStatus1 = TASK_STATUS.inProgress;
    const taskStatus2 = TASK_STATUS.done;

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
                    {
                        id: taskId2,
                        author: taskAuthor2,
                        title: taskTitle2,
                        description: taskDescription2,
                        dueDate: taskDueDate2,
                        status: taskStatus2,
                    },
                ]
            }
        ])
    });

    it('Should subscribe to delete tasks by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);

        const payloadMessage = JSON.stringify({
            user: 'Mr Crabs',
            method: WEBSOCKET_MESSAGE_METHODS.delete,
            type: WEBSOCKET_MESSAGE_TYPES.subscribe,
        });

        const responseMessages = [];

        client.on('message', (data) => {
            responseMessages.push(convertToJSON(data.toString()));

            // should get 4 messages - than close connection
            if (responseMessages.length >= 4) {
                client.close();
            }
        });

        // Send client message
        client.send(payloadMessage);

        await helper.app.db.Task.destroy({
            where: { id: taskId1 },
        });
        await helper.app.db.Task.destroy({
            where: { id: taskId2 },
        });

        // Wait when client will close
        await helper.waitForSocketState(client, client.CLOSED);

        expect(responseMessages).to.be.eql([
            {
                status: 200,
                message: 'Successfully subscribed',
            },
            'pong',
            {
                method: WEBSOCKET_MESSAGE_METHODS.delete,
                id: taskId1,
                title: taskTitle1,
                status: taskStatus1,
                author: taskAuthor1,
                dueDate: taskDueDate1,
                description: taskDescription1,
                createdAt: responseMessages[2].createdAt,
                updatedAt: responseMessages[2].updatedAt,
            },
            {
                method: WEBSOCKET_MESSAGE_METHODS.delete,
                id: taskId2,
                title: taskTitle2,
                status: taskStatus2,
                author: taskAuthor2,
                dueDate: taskDueDate2,
                description: taskDescription2,
                createdAt: responseMessages[3].createdAt,
                updatedAt: responseMessages[3].updatedAt,
            }
        ]);
    });
});