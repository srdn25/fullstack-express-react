const CreateTask = require('../CreateTask');

class CreateTaskStrategy {
    constructor(app) {
        this.app = app;
        this.createTask = new CreateTask({ app })
    }

    handleTaskChange (data) {
        return this.createTask.create(data);
    }
}

module.exports = CreateTaskStrategy;