const metaData = require('../../package.json');
const utils = require('../utils');

async function isReady (app, req, res) {
    const database = await utils.checkPromiseResult(app.db.sequelize.authenticate);

    res.send({
        services: {
            database,
        },
        application: {
            env: process.env.NODE_ENV,
            version: metaData.version,
            nodejs: process.version,
        }
    })
}

module.exports = {
    isReady,
}