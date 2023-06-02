const GetTask = require('../GetTask');

class GetTaskStrategy {
    constructor(app) {
        this.app = app;
        this.getTask = new GetTask({ app })
    }

    handleTaskChange (data) {
        return this.getTask.getTaskById(data.id);
    }
}

module.exports = GetTaskStrategy;