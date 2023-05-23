const App = require('./src/initializers/App');

async function start () {
    const app = new App(process.env);

    await app.init();

    app.logger.info('App successfully started');
}
start().catch((error) => process.stdout.write(error));