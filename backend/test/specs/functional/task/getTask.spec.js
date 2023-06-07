const helper = require('../../helper');
const { prepareDate } = require('../../../../src/utils');
const { consts: { TASK_STATUS } } = require('../../../../src/utils');

const { expect } = helper;

describe('[GET] /task', () => {
    const taskId = helper.generateId();
    const taskId2 = helper.generateId();
    const taskTitle = helper.generateText();
    const taskTitle2 = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDescription2 = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(1));
    const taskDueDate2 = prepareDate(helper.generateFutureDate(1));
    const notExistingTaskId = helper.generateId();
    const taskAuthor = 'Dean';
    const taskAuthor2 = 'Bob';
    const taskStatus = TASK_STATUS.done;
    const taskStatus2 = TASK_STATUS.todo;

    beforeEach(async () => {
        await helper.clearDataInTable('Task');
        await helper.addFixtures([
            {
                model: 'Task',
                data: [
                    {
                        id: taskId,
                        author: taskAuthor,
                        title: taskTitle,
                        description: taskDescription,
                        dueDate: taskDueDate,
                        status: taskStatus,
                    },
                    {
                        id: taskId2,
                        author: taskAuthor2,
                        title: taskTitle2,
                        description: taskDescription2,
                        dueDate: taskDueDate2,
                        status: taskStatus2,
                    }
                ]
            }
        ])
    });

    it('Should return 404 status and message if task not found', async () => {
        const { body } = await helper.request
            .get(`/task/${notExistingTaskId}`)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404);

        expect(body).to.deep.eql({
            status: 404,
            message: 'Task not found',
        });
    });

    it('Should return task if found', async () => {
        const { body } = await helper.request
            .get(`/task/${taskId}`)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(body).to.deep.eql({
            id: taskId,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            author: taskAuthor,
            dueDate: taskDueDate,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt,
        });
    });

    it('Should return all tasks', async () => {
        const { body } = await helper.request
            .get('/task')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(body.sort((a, b) => a.id - b.id)).to.deep.eql([ {
            id: taskId,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            author: taskAuthor,
            dueDate: taskDueDate,
            createdAt: body[0].createdAt,
            updatedAt: body[0].updatedAt,
        }, {
            id: taskId2,
            title: taskTitle2,
            description: taskDescription2,
            status: taskStatus2,
            author: taskAuthor2,
            dueDate: taskDueDate2,
            createdAt: body[1].createdAt,
            updatedAt: body[1].updatedAt,
        } ].sort((a, b) => a.id - b.id));
    });
})