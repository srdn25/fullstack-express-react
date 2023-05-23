const GetTaskAction = require('../actions/GetTask');
const CreateTaskAction = require('../actions/CreateTask');
const UpdateTaskAction = require('../actions/UpdateTask');

async function createTask (app, req, res) {
    const data = req.body;

    if (!data) {
        throw new app.TransportError({
            message: 'Request should contains data for create a task',
            status: 400
        });
    }
    if (!data.title) {
        throw new app.TransportError({
            message: 'Task title is required',
            status: 400
        });
    }
    if (!data.dueDate) {
        throw new app.TransportError({
            message: 'Task due date is required',
            status: 400
        });
    }

    const createTaskAction = new CreateTaskAction({
        title: data.title,
        dueDate: data.dueDate,
        description: data.description,
    });

    const task = await createTaskAction.create();

    res.send(task);
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

async function updateTask (app, req, res) {
    const data = req.body;

    if (!data) {
        throw new app.TransportError({
            message: 'Nothing for update',
            status: 400
        });
    }

    const updateTaskAction = new UpdateTaskAction(data);

    const task = await updateTaskAction.update();

    res.send(task);
}

function deleteTask (app, req, res) {

}

module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask,
}