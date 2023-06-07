const taskHandler = require('../controller/http/task');
const infoHandler = require('../controller/http/info');

const endpoints = [
    {
        method: 'get',
        path: '/isready',
        handler: infoHandler.isReady,
    },
    {
        method: 'post',
        path: '/task',
        handler: taskHandler.createTask,
    },
    {
        method: 'get',
        path: '/task/:taskId',
        handler: taskHandler.getTask,
    },
    {
        method: 'get',
        path: '/task',
        handler: taskHandler.getAllTasks,
    },
    {
        method: 'put',
        path: '/task/:taskId',
        handler: taskHandler.updateTask,
    },
    {
        method: 'delete',
        path: '/task/:taskId',
        handler: taskHandler.deleteTask,
    },
];

module.exports = {
    connect (app) {
        endpoints.forEach((endpoint) => {
            app.httpServer[endpoint.method](endpoint.path, async (req, res, next) => {
                try {
                    await endpoint.handler(app, req, res);
                } catch (error) {
                    app.logger.error(error);
                    next(error);
                }
            });
        })

        app.httpServer
            .get('*', (req, res) => res.status(404).send('Page not found'))
            .put('*', (req, res) => res.status(404).send('Page not found'))
            .post('*', (req, res) => res.status(404).send('Page not found'))
            .delete('*', (req, res) => res.status(404).send('Page not found'))
    }
}