const ActionBase = require('../ActionBase');
const moment = require('moment/moment');

class CreateTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.dueDate = props.dueDate;
        this.title = props.title;
        this.description = props.description;
        this.author = props.author;
    }

    // this method will in abstract class because create class should be able to create task
    async create() {
        const { Task } = this.app.db;
        let task;

        this.validate();

        try {
            task = await Task.create({
                title: this.title,
                dueDate: this.dueDate,
                author: this.author,
                ...this.description ? { description: this.description } : {},
            });
        } catch (error) {
            const message = 'Error on save task to database';
            throw new this.app.TransportError({
                message,
                status: 400,
                error,
            });
        }

        return this.serialize(task);
    }

    validate() {
        if (!this.dueDate) {
            throw new this.app.TransportError({
                status: 400,
                message: 'For create task dueDate is required',
            })
        }

        if (!this.author || typeof this.author !== 'string' || this.author.match(/^(\w|\s){2,15}$/) === null) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Author is required. And this should contains only letter, digit',
            })
        }

        if (!moment(this.dueDate).isValid()) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Date should be in next format YYYY-MM-DD HH:MM',
            })
        }

        if (!this.title || typeof this.title !== 'string' || this.title.match(/^(\w|\s){3,150}$/) === null) {
            throw new this.app.TransportError({
                status: 400,
                message: 'For create task title is required',
            })
        }

        if (this.description && (typeof this.description !== 'string' || this.description.match(/^(\w|\s|\.|\,){3,1000}$/) === null)) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Task description should be string contains only letter, digit or underscore',
            })
        }
    }

    // prepare data for response
    serialize(task) {
        if (!task) {
            throw new this.app.TransportError({
                status: 500,
                message: 'Has not task for serialize after create',
            });
        }

        // here can add other data for response
        return task.serialize();
    }
}

module.exports = CreateTaskAbstract;