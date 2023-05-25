const helper = require('../helper');

before(async () => {
    await helper.initServer();
    await helper.initRequests();
    await helper.clearDatabase();
});