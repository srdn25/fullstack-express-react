const bodyParser = require('body-parser');

function setHeaders (req, res, next) {
    res.setHeader('charset', 'utf-8');
    res.setHeader('Content-Type', 'application/json');
}

// return set for guarantee order of middlewares
module.exports = new Set([
    bodyParser.urlencoded({
        extended: true,
    }),
    bodyParser.json(),
]);