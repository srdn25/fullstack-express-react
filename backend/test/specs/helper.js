const chai = require('chai');
const supertest = require('supertest');
const faker = require('faker');

const App = require('../../src/initializers/App');
const { fromDateToString, prepareDate } = require('../../src/utils');
const migrations = require('../../scripts/migration');
const sinon = require('sinon');

const createdIds = new Set();

const helper = {
    // 1
    initServer: async () => {
        helper.app = new App(process.env);
        await helper.app.init();
    },
    // 2
    initRequests: () => {
       const methods = [ 'get', 'post', 'put', 'delete' ];
       const request = supertest(helper.app.httpServer);
       helper.request = methods.reduce((acc, method) => {
           acc[method] = (url) => request[method](url);
           return acc;
       }, {});
    },
    // 3
    async clearDatabase () {
        await helper.app.db.sequelize.query(`DROP DATABASE IF EXISTS ${process.env.TEST_DB_NAME};`);
        await helper.app.db.sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.TEST_DB_NAME};`);

        // await migrations.apply('down', helper.app.db.sequelize);
        await migrations.apply('up', helper.app.db.config);
        await helper.app.db.sequelize.query(`USE ${helper.app.db.config.database}`);

    },
    generateId: () => {
        const id = faker.datatype.number({ min: 3000 });

        if (createdIds.has(id)) {
            return this.generateId();
        }

        createdIds.add(id);

        return id;
    },
    generateText: (fewWords = true) => {
        if (fewWords) {
            return faker.lorem.words(3);
        }

        return faker.lorem.sentences(1);
    },
    generateFutureDate (days = 0) {
        const today = new Date();
        return new Date(today.setDate(today.getDate() + days));
    },
    async addFixtures (dataList) {
       try {
           await Promise.all(dataList.map((d) => {
               return helper.app.db[d.model].bulkCreate(d.data);
           }));
       } catch (error) {
           process.stdout.write(`Error on create fixture: ${error.sql}.\nMessage: ${error.message}`);
           throw error;
       }
    },
    chai,
    expect: chai.expect,
    sandbox: sinon.createSandbox(),
    assert: sinon.assert,
    waitForSocketState (socket, state) {
        return new Promise((resolve) => {
            setTimeout( () => {
                if (socket.readyState === state) {
                    resolve();
                } else {
                    this.waitForSocketState(socket, state).then(resolve);
                }
            }, 5);
        });
    },
    async createTask (data) {
        let task;

        if (data) {
            task = await helper.app.db.Task.create(data);
        } else {
            task = await helper.app.db.Task.create({
                id: this.generateId(),
                title: this.generateText(true),
                description: this.generateText(),
                dueDate: prepareDate(this.generateFutureDate(3)),
                author: 'AuthorName',
            });
        }

        return task.serialize();
    },
    async clearDataInTable (table) {
        if (!table || typeof table !== 'string' || !helper.app.db[table]) {
            throw new Error('Table not found in database');
        }

        return helper.app.db[table].destroy({
            where: {},
            truncate: true,
        })
    }
};

module.exports = helper;