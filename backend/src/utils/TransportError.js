class TransportError extends Error {
    constructor({ message, error, status }) {
        super(message);
        this.message = message;
        this.status = status;
        this.error = error;
    }

    serialize() {
        return {
            status: this.status,
            message: this.message,
            error: this.error?.message,
        }
    }
}

module.exports = TransportError;