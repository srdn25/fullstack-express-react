class GetTaskAbstract {
    constructor({ app }) {
        this.app = app;
    }

    async getTaskById(id) {
        const task = await this.findTask({ id });

        this.validate(task);

        return task.serialize();
    }

    async findTask(where) {}

    validate(task) {}
}

module.exports = GetTaskAbstract;