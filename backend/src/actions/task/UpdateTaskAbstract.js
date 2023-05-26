const CreateOrUpdateValidation = require('./CreateOrUpdateValidation');

class UpdateTaskAbstract extends CreateOrUpdateValidation {
    constructor(props) {
        super(props);
        this.taskId = props.taskId;
    }

    async update () {
        const { Task, sequelize } = this.app.db;
        let task;

        this.validate();

        const transaction = sequelize.transaction({ autocommit: false });

        try {
            task = await Task.findOne({
                where: { id: this.taskId },
                lock: transaction.lock.UPDATE,
                transaction,
            });

            if (!task) {
                throw new this.app.TransportError({
                    message: 'Has not task for update',
                    status: 400,
                });
            }

            task = await Task.update({
                ...this.title ? { title: this.title } : {},
                ...this.dueDate ? { dueDate: this.dueDate } : {},
                ...this.description ? { description: this.description } : {},
            }, {
                returning: true,
                where: { id: this.taskId },
                transaction,
            });

            await transaction.commit();

            return task;
        } catch (error) {
            await transaction.rollback();

            const message = 'Error on update task';
            throw new this.app.TransportError({
                message,
                status: 400,
                error,
            });
        }
    }
}

module.exports = UpdateTaskAbstract;