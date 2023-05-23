const helper = require('../../helper');
const metaData = require('../../../../package.json');
describe('[GET] /task', () => {
    it('Should return 404 status and message if task not found', async () => {
        const { body } = await helper.request.get('/task').expect(404);
        helper.expect(body).to.deep.eql({
            services: {
                database: true,
            },
            application: {
                env: process.env.NODE_ENV,
                version: metaData.version,
                nodejs: process.version,
            }
        });
    });
})