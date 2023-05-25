const ActionBase = require('../ActionBase');

class GetTaskAbstract extends ActionBase {
    constructor(props) {
        super(props);
        this.taskId = props.taskId;
    }

    async #findTask(where) {}

    async #validate() {}
}

module.exports = GetTaskAbstract;