const helper = require('../../../helper');
const GetTaskAction = require('../../../../../src/controller/actions/task/GetTask');

const { assert } = helper;

describe('[UNIT] GetTask action', async () => {
    it('On getTaskById should call Task model findOne once', async () => {
        const taskId = helper.generateId();
        const serializeSpy = helper.sandbox.spy();

        const fakeApp = {
            db: {
                Task: {
                    findOne: helper.sandbox.stub().returns({ title: 'some string', serialize: serializeSpy }),
                }
            }
        };

        const getTaskAction = new GetTaskAction({ app: fakeApp });

        await getTaskAction.getTaskById(taskId);

        assert.calledOnce(fakeApp.db.Task.findOne);
        assert.calledWith(fakeApp.db.Task.findOne, { where: { id: taskId } });
        assert.calledOnce(serializeSpy);
    });
});
