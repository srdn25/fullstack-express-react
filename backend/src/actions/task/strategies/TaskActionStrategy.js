class TaskActionStrategy {
    #strategy = null;

    constructor(props) {
        this.app = props.app;
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