const CreateTask = require('../CreateTask');

class CreateTaskStrategy {
    handleTaskChange (data) {
        const createTask = new CreateTask(data)

        return createTask.create();
    }
}

module.exports = CreateTaskStrategy;