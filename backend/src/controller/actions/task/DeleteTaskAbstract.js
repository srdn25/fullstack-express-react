const ActionBase = require('../ActionBase');

class DeleteTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
    }

    async delete (id) {
        const { Task, sequelize } = this.app.db;

        this.validate();

        const transaction = await sequelize.transaction({ autocommit: false });

        try {
            const task = await Task.findOne({ where: { id } })

            if (!task) {
                throw new this.app.TransportError({
                    message: 'Not found task for delete',
                    status: 404,
                });
            }

            await Task.destroy({
                where: { id },
                transaction,
            })

            await transaction.commit();

            return {
                status: 204,
                message: 'Task deleted',
            };
        } catch (error) {
            await transaction.rollback();

            const message = 'Error on delete task';
            throw new this.app.TransportError({
                message: error.message || message,
                status: error.status || 400,
                ...!error.message && { error },
            });
        }
    }

    // check dependencies before delete task
    validate () {
        return true;
    }
}

module.exports = DeleteTaskAbstract;