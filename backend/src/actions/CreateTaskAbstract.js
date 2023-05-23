const ActionBase = require('./ActionBase');

class CreateTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.dueDate = props.dueDate;
        this.title = props.title;
        this.description = props.description;
    }

    async create() {
        const { Task } = this.app.db;
        let task;

        this.#validate();

        try {
            task = await Task.create({
                title: this.title,
                dueDate: this.dueDate,
                description: this.description,
            });
        } catch (error) {
            const message = 'Error on save task to database';
            throw new this.app.TransportError({
                message,
                status: 400,
                error,
            });
        }

        return this.#serialize(task);
    }

    // prepare data for response
    #serialize(task) {}
}

module.exports = CreateTaskAbstract;