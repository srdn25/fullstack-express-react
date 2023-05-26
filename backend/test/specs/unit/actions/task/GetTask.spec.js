const helper = require('../../../helper');
const GetTaskAction = require('../../../../../src/actions/task/GetTask');

const { assert } = helper;

describe('[UNIT] GetTask action', async () => {
    it('On getTaskById should call Task model findOne once', async () => {
        const taskId = helper.generateId();
        const serializeSpy = helper.spy();

        const fakeApp = {
            db: {
                Task: {
                    findOne: helper.stub().returns({ title: 'some string', serialize: serializeSpy }),
                }
            }
        };

        const getTaskAction = new GetTaskAction({ app: fakeApp, taskId });

        await getTaskAction.getTaskById();

        assert.calledOnce(fakeApp.db.Task.findOne);
        assert.calledWith(fakeApp.db.Task.findOne, { where: { id: taskId } });
    });
});
