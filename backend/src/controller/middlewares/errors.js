function errorHandler (err, req, res, next) {
    const status = err.status || 500;
    res.status(status);

    if (err.message) {
        res.send({
            status,
            message: err.message,
            error: err?.error?.message,
        })
    } else {
        res.send('Unknown error');
    }
}

module.exports = new Set([
    errorHandler,
]);
