const CreateTask = require('../CreateTask');
const { WEBSOCKET_MESSAGE_METHODS } = require('../../../../utils/consts');

class CreateTaskStrategy {
    constructor(app) {
        this.app = app;
        this.createTask = new CreateTask({ app });
        this.method = WEBSOCKET_MESSAGE_METHODS.create;
    }

    async handleTaskChange (data) {
        const payload = await this.createTask.create(data);

        return {
            method: this.method,
            payload,
        };
    }
}

module.exports = CreateTaskStrategy;