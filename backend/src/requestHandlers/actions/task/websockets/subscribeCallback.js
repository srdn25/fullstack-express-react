module.exports = (uniqueKey) => {
    function callback (data) {
        try {
            this.webSocketSend(JSON.stringify(data));
        } catch (error) {
            this.app.logger.debug({
                message: 'Cannot send data by websocket to client',
                error,
            });
        }
    }

    // set unique callback name - uniq username (we allow only one connection for user)
    // for many connections need to combine userId with uuid
    Object.defineProperty(callback, 'name', { value: uniqueKey });

    return callback;
}