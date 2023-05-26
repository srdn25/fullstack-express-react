const ActionBase = require('../ActionBase');
const moment = require('moment');

class CreateOrUpdateValidation extends ActionBase {
    constructor(props) {
        super(props);
        this.dueDate = props.dueDate;
        this.title = props.title;
        this.description = props.description;
        this.author = props.author;
    }

    validate() {
        if (!this.dueDate) {
            throw new this.app.TransportError({
                status: 400,
                message: 'For create task dueDate is required',
            })
        }

        if (!this.author || this.author.match(/^(\w|\s){2,15}$/) === null) {
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

        if (this.description && (typeof this.description !== 'string' || this.description.match(/^(\w|\s){3,300}$/) === null)) {
            throw new this.app.TransportError({
                status: 400,
                message: 'Task description should be string contains only letter, digit or underscore',
            })
        }
    }
}

module.exports = CreateOrUpdateValidation;