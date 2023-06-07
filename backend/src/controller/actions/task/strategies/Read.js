const GetTask = require('../GetTask');
const { WEBSOCKET_MESSAGE_METHODS } = require('../../../../utils/consts');

class GetTaskStrategy {
    constructor(app) {
        this.app = app;
        this.getTask = new GetTask({ app })
        this.method = WEBSOCKET_MESSAGE_METHODS.read;
    }

    async handleTaskChange (data) {
        let payload = null;

        if (data.id) {
            payload = await this.getTask.getTaskById(data.id);
        } else if (data.where) {
            // temporary hack
            if (data.where === '*') {
                payload = await this.getTask.getAllTasks();
            }
        }

        return {
            method: this.method,
            payload,
        };
    }
}

module.exports = GetTaskStrategy;