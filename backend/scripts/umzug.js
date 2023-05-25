const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(process.cwd(), 'src', 'database', 'config.js'))[env];

require('./migration').umzug(config).runAsCLI();