const helper = require('../../helper');
const { prepareDate } = require('../../../../src/utils');

const { expect } = helper;

describe('[POST] /task', () => {
    it('Should able to create task if all required fields in request', async () => {
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
            message: 'Task description should be string contains only letter, digit or underscore',
        });
    });
});