const express = require('express');
const db = require('../database/models');
const routes = require('../router');
const middlewares = require('../middlewares');
const { convertToString, TransportError } = require('../utils');

class App {
    constructor(config) {
        this.config = config;
        this.logger = ['info', 'error', 'log', 'debug']
            .reduce((logger, type) => {
                logger[type] = (msg) => console.log(convertToString(msg));
                return logger;
            }, {});
    }

    async init () {
        this.db = db;

        this.httpServer = express();
        this.TransportError = TransportError;
        this.connectRoutesAndMiddlewares(this);

        const startServerResult = await this.startHttpServer(this.config.PORT, this.httpServer);
        this.logger.info(startServerResult);
    }

    connectRoutesAndMiddlewares (app) {
        middlewares.forEach((mw) => app.httpServer.use(mw));

        routes.connect(app);
    }

    startHttpServer (port, server) {
        return new Promise((resolve) => {
            server.listen(port, () => {
                resolve(`Application started on ${port} port!`);
            })
        })
    }
}

module.exports = App;