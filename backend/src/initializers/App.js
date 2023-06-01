const express = require('express');
const db = require('../database/models');
const routes = require('../router');
const middlewares = require('../requestHandlers/middlewares');
const errorMiddlewares = require('../requestHandlers/middlewares/errors');
const websocketServer = require('../services/websocketServer');
const PubSub = require('../services/pubSub');

const { convertToString, TransportError } = require('../utils');

class App {
    constructor(config) {
        this.config = config;
        // this.logger = ['info', 'error', 'log', 'debug']
        //     .reduce((logger, type) => {
        //         logger[type] = (msg) => console.log(convertToString(msg));
        //         return logger;
        //     }, {});

        this.logger = {
            info: (msg) => console.log(convertToString(msg)),
            error: (msg) => console.log(convertToString(msg)),
            log: (msg) => console.log(convertToString(msg)),
            debug: (msg) => console.log(convertToString(msg)),
        }
    }

    async init () {
        /**
         * userId
         *      {
         *          create: callbackFunction,
         *          update: callbackFunction,
         *          delete: callbackFunction,
         *      }
         */
        this.callbackList = new Map();

        this.db = db(this);

        await this.db.sequelize.sync();
        await this.db.sequelize.query(`USE ${this.db.config.database}`);

        this.httpServer = express();
        this.TransportError = TransportError;
        this.connectRoutesAndMiddlewares(this);

        this.pubsub = new PubSub({ logger: this.logger });
        this.websocket = websocketServer(this);

        const startServerResult = await this.startHttpServer(this.config.PORT, this.httpServer);
        this.logger.info(startServerResult);
    }

    connectRoutesAndMiddlewares (app) {
        middlewares.forEach((mw) => app.httpServer.use(mw));

        routes.connect(app);

        errorMiddlewares.forEach((wm) => app.httpServer.use(wm));
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