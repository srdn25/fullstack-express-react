const DeleteTask = require('../DeleteTask');

class DeleteTaskStrategy {
    constructor(app) {
        this.app = app;
        this.deleteTask = new DeleteTask({ app })
    }

    handleTaskChange (data) {
        return this.deleteTask.delete(data.id);
    }
}

module.exports = DeleteTaskStrategy;