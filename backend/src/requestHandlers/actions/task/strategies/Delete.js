const DeleteTask = require('../DeleteTask');

class DeleteTaskStrategy {
    handleTaskChange (data) {
        const deleteTask = new DeleteTask(data)

        return deleteTask.delete();
    }
}

module.exports = DeleteTaskStrategy;