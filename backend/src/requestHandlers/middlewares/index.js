const bodyParser = require('body-parser');

function setHeaders (req, res, next) {
    res.setHeader('charset', 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    next();
}

// return set for guarantee order of middlewares
module.exports = new Set([
    setHeaders,
    bodyParser.urlencoded({
        extended: true,
    }),
    bodyParser.json(),
]);