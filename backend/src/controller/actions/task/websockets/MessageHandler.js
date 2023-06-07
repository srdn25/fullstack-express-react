const MessageHandlerAbstract = require('./MessageHandlerAbstract');
const { WEBSOCKET_MESSAGE_TYPES, WEBSOCKET_MESSAGE_METHODS } = require('../../../../utils/consts');

const TaskActionStrategy = require('../strategies/TaskActionStrategy');

const CreateStrategy = require('../strategies/Create');
const ReadStrategy = require('../strategies/Read');
const UpdateStrategy = require('../strategies/Update');
const DeleteStrategy = require('../strategies/Delete');

const subscribeCallback = require('./subscribeCallback');

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

        this.webSocketSend = props.send;
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

        if (!data.type || !Object.values(WEBSOCKET_MESSAGE_TYPES).includes(data.type)) {
            throw new this.app.TransportError({
                status: 400,
                message: `Undefined or not allowed message type - ${data.type}`,
            })
        }

        if (!data.method || !Object.values(WEBSOCKET_MESSAGE_METHODS).includes(data.method)) {
            throw new this.app.TransportError({
                status: 400,
                message: `Not allowed message method - ${data.method}`,
            })
        }

        if (data.type === WEBSOCKET_MESSAGE_TYPES.subscribe && data.method === WEBSOCKET_MESSAGE_METHODS.read) {
            throw new this.app.TransportError({
                status: 400,
                message: `No make sense subscribe to this method - ${data.method}`,
            })
        }

        this.type = data.type;
        this.method = data.method;
        this.user = data.user;
    }

    async handle (payload) {
        // the same methods as for http
        if (this.type === WEBSOCKET_MESSAGE_TYPES.send) {
            const Strategy = STRATEGIES[this.method];

            const taskActionStrategy = new TaskActionStrategy(this.app);

            taskActionStrategy.setStrategy(Strategy);

            const result = await taskActionStrategy.executeStrategy(payload);

            return {
                type: this.type,
                ...result,
            }
        }

        // subscribe to actions (update, delete, create)
        if (this.type === WEBSOCKET_MESSAGE_TYPES.subscribe) {
            const supportMethods = [
                WEBSOCKET_MESSAGE_METHODS.create,
                WEBSOCKET_MESSAGE_METHODS.update,
                WEBSOCKET_MESSAGE_METHODS.delete,
            ];

            if (!supportMethods.includes(this.method)) {
                throw new this.app.TransportError({
                    code: 400,
                    message: 'Allowed only update, delete, and create methods for subscribe'
                });
            }

            const callback = subscribeCallback(this.user);

            const userCallbacks = this.app.callbackList.get(this.user);

            // user already has subscribes to events
            if (userCallbacks && userCallbacks[this.method]) {
                this.app.logger.debug({
                    message: `User: ${this.user} try to subscribe more than 1 time to the same method (${this.method})`,
                });
            } else {
                // this is first user subscribe
                this.app.callbackList.set(this.user, {
                    ...userCallbacks && userCallbacks,
                    [this.method]: callback.bind(this),
                })
            }

            const payload = this.app.pubsub.subscribe(this.method, callback);

            return {
                type: this.type,
                method: this.method,
                payload,
            }
        }

        this.app.logger.error({
            message: 'On some reason, websocket message type - is not "subscribe" or "send". Need investigate it!',
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
        const userCallbacks = this.app.callbackList.get(this.user);

        // remove callback from pubsub
        if (userCallbacks) {
            for (const [method, callback] of Object.entries(userCallbacks)) {
                this.app.pubsub.unsubscribe(method, callback);
            }

            // delete callback from this list
            this.app.callbackList.delete(this.user);
        }

        // remove user from pubsub
        this.users.delete(this.user);
    }
}

module.exports = MessageHandler;