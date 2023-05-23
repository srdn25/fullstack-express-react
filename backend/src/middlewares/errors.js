function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(err.status || 500).send({ error: err.message || 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler (err, req, res) {
    res.status(err.status || 500)
    res.send(err.message || 'Unknown error')
}

module.exports = new Set([
    clientErrorHandler,
    errorHandler,
]);
