const GetTaskAbstract = require('./GetTaskAbstract');

class GetTask extends GetTaskAbstract {
    constructor(props) {
        super(props);
    }

    async getTaskById() {
        const task = await this.findTask({ id: this.taskId });

        this.validate(task);

        return task.serialize();
    }
}

module.exports = GetTask;