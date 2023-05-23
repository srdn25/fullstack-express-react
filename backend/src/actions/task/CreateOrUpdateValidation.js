const ActionBase = require('../ActionBase');
const { fromStringToDate } = require('../../utils');

class CreateOrUpdateValidation extends ActionBase {
    constructor(props) {
        super(props);
        this.dueDate = props.dueDate;
        this.title = props.title;
        this.description = props.description;
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
}

module.exports = CreateOrUpdateValidation;