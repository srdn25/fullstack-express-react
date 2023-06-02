const EventEmitter = require('events');

class PubSub {
    constructor({ logger }) {
        this.eventEmitter = new EventEmitter();
        this.logger = logger;
    }

    /**
     * Subscribe to event
     * @param {string} event - event name
     * @param {function} callback - should be regular function, for unsubscribe
     */
    subscribe(event, callback) {
        this.eventEmitter.addListener(event, callback);
        return {
            status: 200,
            message: 'Successfully subscribed',
        };
    }

    /**
     *
     * @param {string} event - event name
     * @param {function} callback - should be regular function which used for subscribe
     */
    unsubscribe(event, callback) {
        this.eventEmitter.removeListener(event, callback);
    }

    /**
     * Send event with data to listeners
     * @param {string} event
     * @param {object} data
     */
    sendEven(event, data = {}) {
        this.eventEmitter.emit(event, data);
    }
}

module.exports = PubSub;