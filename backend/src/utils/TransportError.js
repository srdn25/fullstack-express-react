class TransportError extends Error {
    constructor({ message, error, status }) {
        super(message);
        this.message = message;
        this.status = status;
        this.error = error;
    }
}

module.exports = TransportError;