const helper = require('../../helper');
const { prepareDate } = require('../../../../src/utils');
const { consts: { TASK_STATUS } } = require('../../../../src/utils');

const { expect } = helper;

describe('[PUT] /task/:taskId', () => {
    const taskId = helper.generateId();
    const notExistingTaskId = helper.generateId();
    const taskTitle = helper.generateText();
    const taskDescription = helper.generateText(false);
    const taskDueDate = prepareDate(helper.generateFutureDate(1));
    const taskAuthor = 'Sandy Cheeks';

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

    it('Should return 404 response if task not found for delete', async () => {
        const { body } = await helper.request
            .delete(`/task/${notExistingTaskId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404);

        expect(body).to.be.an('object');
        expect(body).to.have.property('message');
        expect(body).to.deep.eql({
            message: 'Not found task for delete',
        });
    });

    it('Should delete task', async () => {
        const taskBefore = await helper.app.db.Task.findOne({ where: { id: taskId  } });

        expect(taskBefore).to.be.an('object');
        expect(taskBefore).to.have.property('id');
        expect(taskBefore).to.have.property('title');
        expect(taskBefore).to.have.property('dueDate');
        expect(taskBefore).to.have.property('author');
        expect(taskBefore).to.have.property('description');
        expect(taskBefore).to.have.property('status');

        const { body } = await helper.request
            .delete(`/task/${taskId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(body).to.be.an('object');
        expect(body).to.have.property('message');
        expect(body).to.deep.eql({
            message: 'Task deleted',
        });

        const taskAfter = await helper.app.db.Task.findOne({ where: { id: taskId  } });
        expect(taskAfter).to.be.null;
    });
});