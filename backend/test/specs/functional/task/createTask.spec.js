const helper = require('../../helper');
const { prepareDate } = require('../../../../src/utils');
const { consts: { TASK_STATUS } } = require('../../../../src/utils');

const { expect } = helper;

describe('[POST] /task', () => {
    it('Should able to create task if request contains all required fields', async () => {
        const payload = {
            title: helper.generateText(),
            dueDate: prepareDate(helper.generateFutureDate(3)),
            author: 'Patric',
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201);

        expect(body).to.deep.eql({
            id: body.id,
            title: payload.title,
            dueDate: payload.dueDate,
            author: payload.author,
            status: 'todo',
            createdAt: body.createdAt,
            updatedAt: body.updatedAt,
        });
        expect(typeof body.id === 'number').to.be.true;

        const taskFromDatabase = await helper.app.db.Task.findOne({ where: { id: body.id } });

        expect(taskFromDatabase.serialize()).to.deep.eql(body);
    });

    it('Should able to create task with description', async () => {
        const payload = {
            title: helper.generateText(),
            dueDate: prepareDate(helper.generateFutureDate(3)),
            author: 'Patric',
            description: helper.generateText(false),
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201);

        expect(body).to.deep.eql({
            id: body.id,
            title: payload.title,
            dueDate: payload.dueDate,
            author: payload.author,
            status: TASK_STATUS.todo,
            description: payload.description,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt,
        });
        expect(typeof body.id === 'number').to.be.true;

        const taskFromDatabase = await helper.app.db.Task.findOne({ where: { id: body.id } });

        expect(taskFromDatabase.serialize()).to.deep.eql(body);
    });

    it('Should get error if author not listed in request', async () => {
        const payload = {
            title: helper.generateText(),
            dueDate: prepareDate(helper.generateFutureDate(3)),
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'Author is required. And this should contains only letter, digit',
        });
    });

    it('Should get error if title not listed in request', async () => {
        const payload = {
            author: 'Star',
            dueDate: prepareDate(helper.generateFutureDate(3)),
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'Task title is required',
        });
    });

    it('Should get error if dueDate not listed in request', async () => {
        const payload = {
            title: helper.generateText(),
            author: 'Squidward',
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'Task due date is required',
        });
    });

    it('Should throw error if trying send now allowed characters in title', async () => {
        const payload = {
            title: 'hack\'+OR+1=1--',
            dueDate: prepareDate(helper.generateFutureDate(3)),
            author: 'Patric',
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'For create task title is required',
        });
    });

    it('Should throw error if trying send now allowed characters in author', async () => {
        const payload = {
            title: 'Simple title',
            dueDate: prepareDate(helper.generateFutureDate(3)),
            author: 'Patric Hacker\'+OR+1=1--',
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'Author is required. And this should contains only letter, digit',
        });
    });

    it('Should throw error if trying send now allowed characters in description', async () => {
        const payload = {
            title: 'Simple title',
            dueDate: prepareDate(helper.generateFutureDate(3)),
            author: 'Mr Crabs',
            description: 'some script \'+OR+1=1--'
        };

        const { body } = await helper.request
            .post('/task')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);

        expect(body).to.deep.eql({
            status: 400,
            message: 'Task description should be string contains only letter, digit or underscore',
        });
    });
});