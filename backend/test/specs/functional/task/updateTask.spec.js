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

    it('Should update task', async () => {
        const payload = {
            dueDate: prepareDate(helper.generateFutureDate(5)),
            author: 'Gary',
            status: TASK_STATUS.inProgress,
        };

        const { body } = await helper.request
            .put(`/task/${taskId}`)
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(body).to.be.an('object');
        expect(body).to.have.property('id');
        expect(body).to.have.property('title');
        expect(body).to.have.property('dueDate');
        expect(body).to.have.property('author');
        expect(body).to.have.property('description');
        expect(body).to.have.property('status');
        expect(body).to.deep.eql({
            id: taskId,
            title: taskTitle,
            author: payload.author,
            dueDate: payload.dueDate,
            status: payload.status,
            description: body.description,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt,
        });
    });

    it('Should return 404 if task not found', async () => {
        const payload = {
            title: 'any string',
        };

        const { body } = await helper.request
            .put(`/task/${notExistingTaskId}`)
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404);

        expect(body).to.be.an('object');
        expect(body).to.have.property('message');
        expect(body).to.deep.eql({
            message: 'Not found task for update',
        });
    });

    it('Should throw error if trying send now allowed characters in title', async () => {
        const payload = {
            title: 'hack\'+OR+1=1--',
        };

        const { body } = await helper.request
            .put(`/task/${taskId}`)
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            message: 'For create task title is required',
        });
    });

    it('Should throw error if trying send now allowed characters in author', async () => {
        const payload = {
            author: 'Patric Hacker\'+OR+1=1--',
        };

        const { body } = await helper.request
            .put(`/task/${taskId}`)
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            message: 'Author is required. And this should contains only letter, digit',
        });
    });

    it('Should throw error if trying send now allowed characters in description', async () => {
        const payload = {
            description: 'some script \'+OR+1=1--'
        };

        const { body } = await helper.request
            .put(`/task/${taskId}`)
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            message: 'Task description should be string contains only letter, digit or underscore',
        });
    });
});