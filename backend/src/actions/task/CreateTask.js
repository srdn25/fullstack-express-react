const CreateTaskAbstract = require('./CreateTaskAbstract');

class CreateTask extends CreateTaskAbstract {
    constructor(props) {
        super(props);
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