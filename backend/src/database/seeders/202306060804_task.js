const { TASK_STATUS } = require('../../utils/consts');

const seedTask = [
    {
        title: 'Buy honey bottle',
        description: 'Shop list',
        status: TASK_STATUS.inProgress,
        dueDate: '2023-06-07 11:00',
        author: 'Zummi',
    },
    {
        title: 'Build boat',
        description: 'Prepare boat for traver',
        status: TASK_STATUS.done,
        dueDate: '2023-06-07 15:00',
        author: 'Gruffi',
    },
    {
        title: 'Buy screwdriver',
        description: 'Shop list',
        status: TASK_STATUS.inProgress,
        dueDate: '2023-06-07 18:00',
        author: 'Zummi',
    },
    {
        title: 'Buy big bottle water',
        description: 'Shop list',
        status: TASK_STATUS.inProgress,
        dueDate: '2023-06-07 13:00',
        author: 'Zummi',
    },
    {
        title: 'Go with Zummi to the shop',
        description: 'Help grandpa',
        status: TASK_STATUS.inProgress,
        dueDate: '2023-06-07 12:00',
        author: 'Tummi',
    },
    {
        title: 'Repair home',
        status: TASK_STATUS.todo,
        description: 'Home work',
        dueDate: '2023-06-08 16:00',
        author: 'Sunni',
    },
    {
        title: 'Clean house',
        status: TASK_STATUS.todo,
        description: 'Home work',
        dueDate: '2023-06-08 15:00',
        author: 'Cavin',
    },
];

const up = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkInsert('tbl_task', seedTask);
};

const down = async ({ context: sequelize }) => {
    //don't delete by not uniq column on real project!
    await sequelize.getQueryInterface().bulkDelete('tbl_task', { title: seedTask.map(task => task.title) });
};

module.exports = {
    up,
    down,
}