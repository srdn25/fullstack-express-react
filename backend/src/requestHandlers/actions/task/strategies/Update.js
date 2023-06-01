const UpdateTask = require('../UpdateTask');

class UpdateTaskStrategy {
    handleTaskChange (data) {
        const updateTask = new UpdateTask(data)

        return updateTask.update();
    }
}

module.exports = UpdateTaskStrategy;