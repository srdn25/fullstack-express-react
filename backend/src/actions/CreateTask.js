const CreateTaskAbstract = require('./CreateTaskAbstract');
const { fromStringToDate } = require('../utils');

class CreateTask extends CreateTaskAbstract {
    constructor(props) {
        super(props);
    }

    #validate() {
        if (!this.dueDate) {
            throw this.app.TransportError({
                status: 400,
                message: 'For create task dueDate is required',
            })
        }

        if (!fromStringToDate(this.dueDate)) {
            throw this.app.TransportError({
                status: 400,
                message: 'Date should be in next format YYYY-MM-DD HH:MM',
            })
        }

        if (!this.title || typeof this.title !== 'string' || this.title.match(/^\w{3,150}$/) === null) {
            throw this.app.TransportError({
                status: 400,
                message: 'For create task title is required',
            })
        }

        if (this.description && (typeof this.description !== 'string' || this.description.match(/^\w{3,150}$/))) {
            throw this.app.TransportError({
                status: 400,
                message: 'Task description should be string contains only letter, digit or underscore',
            })
        }
    }

    #serialize(task) {
        if (!task) {
            throw this.app.TransportError({
                status: 500,
                message: 'Has not task for serialize after create',
            });
        }

        // here can add other data for response
        return task.serialize();
    }
}

module.exports = CreateTask;