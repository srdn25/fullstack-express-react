const CreateOrUpdateValidation = require('./CreateOrUpdateValidation');

class CreateTaskAbstract extends CreateOrUpdateValidation {
    constructor(props) {
        super(props);
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

    #validate() {}
}

module.exports = CreateTaskAbstract;