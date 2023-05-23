const ActionBase = require('./ActionBase');

class GetTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.taskId = props.taskId;
    }

    async getTaskById() {
        const task = await this.#findTask({ id: this.taskId });

        this.#validate(task);

        return task.serialize();
    }

    async #findTask(where) {}
}

module.exports = GetTaskAbstract;