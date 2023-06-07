const UpdateTask = require('../UpdateTask');
const { WEBSOCKET_MESSAGE_METHODS } = require('../../../../utils/consts');

class UpdateTaskStrategy {
    constructor(app) {
        this.app = app;
        this.updateTask = new UpdateTask({ app })
        this.method = WEBSOCKET_MESSAGE_METHODS.update;
    }

    async handleTaskChange (data) {
        const payload = await this.updateTask.update(data);

        return {
            method: this.method,
            payload,
        };
    }
}

module.exports = UpdateTaskStrategy;