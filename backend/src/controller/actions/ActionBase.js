class ActionBase {
    constructor({ app }) {
        this.app = app;
    }

    // should validate data before save to database or send as response
    validate() {}
}

module.exports = ActionBase;