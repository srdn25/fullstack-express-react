const GetTask = require('../GetTask');

class GetTaskStrategy {
    constructor(app) {
        this.app = app;
        this.getTask = new GetTask({ app })
    }

    handleTaskChange (data) {
        if (data.id) {
            return this.getTask.getTaskById(data.id);
        }

        if (data.where) {

            // temporary hack
            if (data.where === '*') {
                return this.getTask.getAllTasks();
            }
        }
    }
}

module.exports = GetTaskStrategy;