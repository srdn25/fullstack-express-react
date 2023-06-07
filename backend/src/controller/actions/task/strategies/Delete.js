const DeleteTask = require('../DeleteTask');
const { WEBSOCKET_MESSAGE_METHODS } = require('../../../../utils/consts');

class DeleteTaskStrategy {
    constructor(app) {
        this.app = app;
        this.deleteTask = new DeleteTask({ app })
        this.method = WEBSOCKET_MESSAGE_METHODS.delete;
    }

    async handleTaskChange (data) {
        const payload = await this.deleteTask.delete(Number(data.id));

        return {
            method: this.method,
            payload,
        };
    }
}

module.exports = DeleteTaskStrategy;