const bodyParser = require('body-parser');

// return set for guarantee order of middlewares
module.exports = new Set([
    bodyParser.urlencoded({
        extended: true,
    }),
    bodyParser.json(),
]);