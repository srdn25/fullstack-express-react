const ActionBase = require('../ActionBase');
const moment = require('moment/moment');

class CreateTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
    }

    // this method will in abstract class because create class should be able to create task
    async create(data) {
        const { Task } = this.app.db;
        let task;

        this.validate(data);

        try {
            task = await Task.create({
                title: data.title,
                dueDate: data.dueDate,
                author: data.author,
                ...data.description ? { description: data.description } : {},
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

    validate(data) {
        if (!data) {
            throw new this.app.TransportError({
                status: 400,
                message: 'You should send data for create task',
            })
        }

        if (!data.dueDate) {
            throw new this.app.TransportError({
                status: 400,
                message: 'For create task dueDate is required',
            })
        }

        if (!data.author || typeof data.author !== 'string' || data.author.match(/^(\w|\s){2,15}$/) === null) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Author is required. And this should contains only letter, digit',
            })
        }

        if (!moment(data.dueDate).isValid()) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Date should be in next format YYYY-MM-DD HH:MM',
            })
        }

        if (!data.title || typeof data.title !== 'string' || data.title.match(/^(\w|\s){3,150}$/) === null) {
            throw new this.app.TransportError({
                status: 400,
                message: 'For create task title is required',
            })
        }

        if (data.description && (typeof data.description !== 'string' || data.description.match(/^(\w|\s|\.|\,){3,1000}$/) === null)) {
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