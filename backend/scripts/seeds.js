const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const umzug = (config) => {
    const sequelize = new Sequelize(config.database, config.username, config.password, config);

    return new Umzug({
        storage: new SequelizeStorage({ sequelize }),
        storageOptions: {
            sequelize,
        },
        context: sequelize,
        migrations: {
            params: [
                sequelize.getQueryInterface(),
                sequelize.constructor,
            ],
            glob: 'src/database/seeders/*.js',
        }
    })
}

module.exports = {
    umzug,
}