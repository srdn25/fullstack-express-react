const GetTaskAction = require('../actions/GetTask');

function createTask (app, req, res) {

}

async function getTask (app, req, res) {
    const { taskId } = req.params;

    if (!taskId) {
        throw app.TransportError({
            message: 'Task id in request params is required! It should be number',
            status: 400,
        })
    }

    // use actions for separate handlers and business logic
    const getTaskAction = new GetTaskAction({ app, taskId });

    const task = await getTaskAction.getTaskById();

    res.send(task);
}

function updateTask (app, req, res) {

}

function deleteTask (app, req, res) {

}

module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask,
}