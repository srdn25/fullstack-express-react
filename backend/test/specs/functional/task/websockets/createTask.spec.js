const WebSocket = require('ws');
const helper = require('../../../helper');
const { WEBSOCKET_MESSAGE_TYPES, TASK_STATUS, WEBSOCKET_MESSAGE_METHODS } = require('../../../../../src/utils/consts');
const { prepareDate, convertToJSON } = require('../../../../../src/utils');

const { expect } = helper;

describe('[FUNCTIONAL] websocket CREATE task', () => {
    it('Should be able create task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);

        await helper.waitForSocketState(client, client.OPEN);
        const payload = {
            dueDate: prepareDate(helper.generateFutureDate(15)),
            title: helper.generateText(),
            description: helper.generateText(false),
            author: 'Patric',
        };

        const payloadMessage = JSON.stringify({
            ...payload,
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.create,
            type: WEBSOCKET_MESSAGE_TYPES.send,
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
                ...payload,
                status: TASK_STATUS.todo,
                id: responseMessages[0].id,
                createdAt: responseMessages[0].createdAt,
                updatedAt: responseMessages[0].updatedAt,
            },
        ]);

        const taskFromDatabase = await helper.app.db.Task.findOne({ where: { id: responseMessages[0].id } });

        expect(!!taskFromDatabase).to.be.true;

        const serializedTask = taskFromDatabase.serialize();

        expect(serializedTask).to.deep.eql(responseMessages[0]);
    });

    it('Should get error if request not contains "author" when create task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);
        const taskCountBefore = await helper.app.db.Task.count();

        await helper.waitForSocketState(client, client.OPEN);
        const payload = {
            dueDate: prepareDate(helper.generateFutureDate(15)),
            title: helper.generateText(),
            description: helper.generateText(false),
        };

        const payloadMessage = JSON.stringify({
            ...payload,
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.create,
            type: WEBSOCKET_MESSAGE_TYPES.send,
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
                status: 400,
                message: 'Author is required. And this should contains only letter, digit',
            },
        ]);

        const taskCountAfter = await helper.app.db.Task.count();

        expect(taskCountBefore).to.be.eql(taskCountAfter);
    });

    it('Should get error if request not contains "title" when create task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);
        const taskCountBefore = await helper.app.db.Task.count();

        await helper.waitForSocketState(client, client.OPEN);
        const payload = {
            dueDate: prepareDate(helper.generateFutureDate(15)),
            author: 'Patric',
            description: helper.generateText(false),
        };

        const payloadMessage = JSON.stringify({
            ...payload,
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.create,
            type: WEBSOCKET_MESSAGE_TYPES.send,
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
                status: 400,
                message: 'For create task title is required',
            },
        ]);

        const taskCountAfter = await helper.app.db.Task.count();

        expect(taskCountBefore).to.be.eql(taskCountAfter);
    });

    it('Should get error if request not contains "dueDate" when create task by websockets', async () => {
        const client = new WebSocket(`ws://localhost:${helper.app.config.WEBSOCKET_PORT}`);
        const taskCountBefore = await helper.app.db.Task.count();

        await helper.waitForSocketState(client, client.OPEN);
        const payload = {
            author: 'Patric',
            title: helper.generateText(),
            description: helper.generateText(false),
        };

        const payloadMessage = JSON.stringify({
            ...payload,
            user: 'Patric',
            method: WEBSOCKET_MESSAGE_METHODS.create,
            type: WEBSOCKET_MESSAGE_TYPES.send,
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
                status: 400,
                message: 'For create task dueDate is required',
            },
        ]);

        const taskCountAfter = await helper.app.db.Task.count();

        expect(taskCountBefore).to.be.eql(taskCountAfter);
    });
});