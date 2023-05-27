const MessageHandlerAbstract = require('./MessageHandlerAbstract');
const { WEBHOOK_MESSAGE_TYPES, WEBHOOK_MESSAGE_METHODS } = require('../../../utils/consts');

const TaskActionStrategy = require('../strategies/TaskActionStrategy');

const CreateStrategy = require('../strategies/Create');
const ReadStrategy = require('../strategies/Read');
const UpdateStrategy = require('../strategies/Update');
const DeleteStrategy = require('../strategies/Delete');
const { c } = require('sinon/lib/sinon/spy-formatters');

const STRATEGIES = {
    create: CreateStrategy,
    read: ReadStrategy,
    update: UpdateStrategy,
    delete: DeleteStrategy,
}

class MessageHandler extends MessageHandlerAbstract {
    constructor(props) {
        super(props);

        this.user = null;
        this.type = null;
        this.method = null;

        // instead of real auth. Allow only uniq user string
        this.users = new Set();

        /**
         * userId
         *      {
         *          create: callbackFunction,
         *          read: callbackFunction,
         *          update: callbackFunction,
         *          delete: callbackFunction,
         *      }
         */
        this.callbackList = new Map();

        this.webhookSend = props.send;
    }

    /**
     * @typedef {object} CheckMessageTypeResponse
     * @property {string=} message
     * @property {object=} response
     * @property {string} response.type
     * @property {string} response.method
     */

    /**
     * Validate message. Allow to subscribe and send (create, read, update, delete) events
     * Set message type, method and user
     * @param {object} data
     * @param {string} data.type - ENUM(subscribe, send)
     * @param {string} data.method - ENUM(create, read, update, delete)
     * @param {object=} data.payload - payload data
     * @param {string} data.user - Our application without authentication (hasn't it in task requirements)
     * so, imagine this param will like JWT with uniq user
     */
    validateMessage (data) {
        if (!data.user || typeof data.user !== 'string') {
            throw new this.app.TransportError({
                status: 401,
                message: 'User is required, and should be string',
            })
        }

        if (!data.type || !Object.values(WEBHOOK_MESSAGE_TYPES).includes(data.type)) {
            throw new this.app.TransportError({
                status: 400,
                message: `Undefined or not allowed message type - ${data.type}`,
            })
        }

        if (!data.method || !Object.values(WEBHOOK_MESSAGE_METHODS).includes(data.method)) {
            return {
                status: 400,
                message: `Undefined or not allowed message method - ${data.method}`,
            }
        }

        this.type = data.type;
        this.method = data.method;
        this.user = data.user;
    }

    handle (payload) {
        if (this.type === WEBHOOK_MESSAGE_TYPES.send) {
            const Strategy = STRATEGIES[this.method];

            const taskActionStrategy = new TaskActionStrategy(this.app);

            taskActionStrategy.setStrategy(Strategy);

            return taskActionStrategy.executeStrategy(payload);
        }

        if (this.type === WEBHOOK_MESSAGE_TYPES.subscribe) {
            function callback (data) {
                this.webhookSend(JSON.stringify(data));
            }

            // set unique callback name - uniq username (we allow only one connection for user)
            // for many connections need to combine userId with uuid
            Object.defineProperty(callback, 'name', { value: this.user });

            const userCallbacks = this.callbackList.get(this.user);

            // user already has subscribes to events
            if (userCallbacks[this.method]) {
                this.app.logger.debug({
                    message: `User: ${this.user} try to subscribe more than 1 time to the same method (${this.method})`,
                });
            } else {
                // this is first user subscribe
                this.callbackList.set(this.user, {
                    ...userCallbacks && userCallbacks,
                    [this.method]: callback,
                })
            }

            this.app.pubsub.subscribe(this.method, callback);
        }

        this.app.logger.error({
            message: 'On some reason webhook message type not subscribe or send. Need investigate it!',
        })
    }

    authenticate () {
        if (!this.user) {
            throw new this.app.TransportError({
                status: 401,
                message: 'Unauthorized',
            });
        }

        if (this.users.has(this.user)) {
            throw new this.app.TransportError({
                status: 403,
                message: 'Allow only one connection for user',
            });
        }

        this.users.add(this.user);
    }

    disconnect () {
        // remove all user callbacks
        const userCallbacks = this.callbackList.get(this.user);

        // remove callback from pubsub
        if (userCallbacks) {
            for (const [method, callback] of Object.entries(userCallbacks)) {
                this.app.pubsub.unsubscribe(method, callback);
            }

            // delete callback from this list
            this.callbackList.delete(this.user);
        }

        // remove user from pubsub
        this.users.delete(this.user);
    }
}

module.exports = MessageHandler;