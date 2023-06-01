const ActionBase = require('../ActionBase');
const moment = require('moment/moment');
const { prepareDate } = require('../../../utils');

class UpdateTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
    }

    async update (data) {
        const { Task, sequelize } = this.app.db;
        let task;

        this.validate(data);

        const transaction = await sequelize.transaction({ autocommit: false });

        try {
            task = await Task.findOne({
                where: { id: data.taskId },
                lock: true,
                transaction,
            });

            if (!task) {
                throw new this.app.TransportError({
                    message: 'Not found task for update',
                    status: 404,
                });
            }

            if (data.title) {
                task.title = data.title;
            }
            if (data.dueDate) {
                task.dueDate = prepareDate(data.dueDate);
            }
            if (data.description) {
                task.description = data.description;
            }
            if (data.author) {
                task.author = data.author;
            }
            if (data.status) {
                task.status = data.status;
            }

            await task.save({ transaction });
            await transaction.commit();

            return task;
        } catch (error) {
            await transaction.rollback();

            const message = 'Error on update task';
            throw new this.app.TransportError({
                message: error.message || message,
                status: error.status || 400,
                ...!error.message && { error },
            });
        }
    }

    validate (data) {
        if (data.taskId && (typeof data.taskId !== 'string' || data.taskId.match(/^[0-9]+$/) === null)) {
            throw new this.app.TransportError({
                status: 400,
                message: 'TaskId is required. And this should contains digit',
            })
        }

        if (data.author && (typeof data.author !== 'string' || data.author.match(/^(\w|\s){2,15}$/) === null)) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Author is required. And this should contains only letter, digit',
            })
        }

        if (data.dueDate && !moment(data.dueDate).isValid()) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Date should be in next format YYYY-MM-DD HH:MM',
            })
        }

        if (data.title && (typeof data.title !== 'string' || data.title.match(/^(\w|\s){3,150}$/) === null)) {
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
}

module.exports = UpdateTaskAbstract;