const GetTaskAbstract = require('./GetTaskAbstract');

class GetTask extends GetTaskAbstract {
    constructor(args) {
        super(args);
        this.taskId = args.taskId;
    }

    async findTask (where) {
        const { Task } = this.app.db;
        let task;

        try {
            task = await Task.findOne({ where });
        } catch (error) {
            const message = 'Error trying find task in database';
            throw new this.app.TransportError({
                message,
                status: 400,
                error,
            });
        }

        return task;
    }

    validate(task) {
        if (!task) {
            throw new Error({
                message: 'Task not found',
                code: 404,
            })
        }
    }
}

module.exports = GetTask;