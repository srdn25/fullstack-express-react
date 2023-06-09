const GetTaskAction = require('../actions/task/GetTask');
const CreateTaskAction = require('../actions/task/CreateTask');
const UpdateTaskAction = require('../actions/task/UpdateTask');
const DeleteTaskAction = require('../actions/task/DeleteTask');

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

    const createTaskAction = new CreateTaskAction({ app });

    const task = await createTaskAction.create({
        title: data.title,
        dueDate: data.dueDate,
        description: data.description,
        author: data.author,
    });

    res.status(201).send(task);
}

async function getTask (app, req, res) {
    const { taskId } = req.params;

    if (!taskId) {
        throw new app.TransportError({
            message: 'Task id in params is required! It should be number',
            status: 400,
        })
    }

    // use actions for separate handlers and business logic
    const getTaskAction = new GetTaskAction({ app });

    const task = await getTaskAction.getTaskById(taskId);

    res.send(task);
}

async function getAllTasks (app, req, res) {
    const getTaskAction = new GetTaskAction({ app });

    const tasks = await getTaskAction.getAllTasks();

    res.send(tasks)
}

async function updateTask (app, req, res) {
    const { taskId } = req.params;
    const data = req.body;

    if (!data || !taskId) {
        throw new app.TransportError({
            message: 'Nothing for update',
            status: 400,
        });
    }

    const updateTaskAction = new UpdateTaskAction({ app });

    const task = await updateTaskAction.update({ ...data, taskId });

    res.send(task);
}

async function deleteTask (app, req, res) {
    const { taskId } = req.params;

    if (!taskId) {
        throw new app.TransportError({
            message: 'You should pass taskId for delete task',
            status: 400
        });
    }

    const deleteTaskAction = new DeleteTaskAction({ app });

    const result = await deleteTaskAction.delete(taskId);

    delete result?.status;

    res.send(result);
}

module.exports = {
    createTask,
    getTask,
    getAllTasks,
    updateTask,
    deleteTask,
}