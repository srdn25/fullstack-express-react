const ActionBase = require('../ActionBase');
const moment = require('moment/moment');
const { prepareDate } = require('../../utils');

class UpdateTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.taskId = props.taskId;
        this.dueDate = props.dueDate;
        this.title = props.title;
        this.description = props.description;
        this.author = props.author;
        this.status = props.status;
    }

    async update () {
        const { Task, sequelize } = this.app.db;
        let task;

        this.#validate();

        const transaction = await sequelize.transaction({ autocommit: false });

        try {
            task = await Task.findOne({
                where: { id: this.taskId },
                lock: true,
                transaction,
            });

            if (!task) {
                throw new this.app.TransportError({
                    message: 'Not found task for update',
                    status: 400,
                });
            }

            if (this.title) {
                task.title = this.title;
            }
            if (this.dueDate) {
                task.dueDate = prepareDate(this.dueDate);
            }
            if (this.description) {
                task.description = this.description;
            }
            if (this.author) {
                task.author = this.author;
            }
            if (this.status) {
                task.status = this.status;
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

    #validate () {
        if (this.author && (typeof this.author !== 'string' || this.author.match(/^(\w|\s){2,15}$/) === null)) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Author is required. And this should contains only letter, digit',
            })
        }

        if (this.dueDate && !moment(this.dueDate).isValid()) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Date should be in next format YYYY-MM-DD HH:MM',
            })
        }

        if (this.title && (typeof this.title !== 'string' || this.title.match(/^(\w|\s){3,150}$/) === null)) {
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
}

module.exports = UpdateTaskAbstract;