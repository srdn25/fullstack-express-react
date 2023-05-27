const GetTask = require('../GetTask');

class GetTaskStrategy {
    handleTaskChange (data) {
        const getTask = new GetTask(data)

        return getTask.getTaskById();
    }
}

module.exports = GetTaskStrategy;