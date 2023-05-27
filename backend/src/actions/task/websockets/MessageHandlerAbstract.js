class WebsocketMessageHandler {
    constructor(props) {
        this.app = props.app;
    }

    /**
     * Imagine we have auth requirements. Here we will check user
     */
    authenticate () {}

    /**
     * Check type and method
     */
    validateMessage () {}

    /**
     * handle request
     */
    handle () {}
}

module.exports = WebsocketMessageHandler;