const ActionBase = require('../ActionBase');

class DeleteTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.taskId = props.taskId;
    }

    async delete () {
        const { Task, sequelize } = this.app.db;

        this.#validate();

        const transaction = sequelize.transaction({ autocommit: false });

        try {
            await Task.destroy({
                where: { id: this.taskId },
                transaction,
            })

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            const message = 'Error on delete task';
            throw new this.app.TransportError({
                message,
                status: 400,
                error,
            });
        }
    }
    // check some dependencies before delete task
    #validate () {
        return true;
    }
}

module.exports = DeleteTaskAbstract;