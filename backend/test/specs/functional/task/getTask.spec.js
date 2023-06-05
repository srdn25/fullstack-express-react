const helper = require('../../helper');
const { prepareDate } = require('../../../../src/utils');
const { consts: { TASK_STATUS } } = require('../../../../src/utils');

const { expect } = helper;

describe('[GET] /task', () => {
    const taskId = helper.generateId();
    const taskTitle = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(1));
    const notExistingTaskId = helper.generateId();
    const taskAuthor = 'Dean';

    before(async () => {
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
            status: TASK_STATUS.todo,
            author: taskAuthor,
            dueDate: taskDueDate,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt,
        });
    });
})