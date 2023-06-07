const GetTaskAbstract = require('./GetTaskAbstract');

class GetTask extends GetTaskAbstract {
    constructor(props) {
        super(props);
    }

    async getTaskById(id) {
        const task = await this.findTask({ id });

        return task.serialize();
    }

    getAllTasks() {
        return this.app.db.Task.findAll({ raw: true });
    }
}

module.exports = GetTask;