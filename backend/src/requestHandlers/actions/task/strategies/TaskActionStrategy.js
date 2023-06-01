class TaskActionStrategy {
    #strategy = null;

    constructor(app) {
        this.app = app;
    }

    setStrategy (Strategy) {
        if (Strategy) {
            this.#strategy = new Strategy(this.app);
        }
    }

    executeStrategy (data) {
        return this.#strategy.handleTaskChange(data);
    }
}

module.exports = TaskActionStrategy;