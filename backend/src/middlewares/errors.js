function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(err.status || 500).send({ error: err.message || 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler (err, req, res, next) {
    res.status(err.status || 500)
    if (err.message) {
        res.send({
            message: err.message,
            error: err?.error?.message,
        })
    } else {
        res.send('Unknown error');
    }
}

module.exports = new Set([
    clientErrorHandler,
    errorHandler,
]);
