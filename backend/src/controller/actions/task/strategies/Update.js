const UpdateTask = require('../UpdateTask');

class UpdateTaskStrategy {
    constructor(app) {
        this.app = app;
        this.updateTask = new UpdateTask({ app })
    }

    handleTaskChange (data) {
        return this.updateTask.update(data);
    }
}

module.exports = UpdateTaskStrategy;