import { taskReducer, initState } from './task';
import * as consts from '../../utils/consts';

test('task reducer should update all tasks', () => {
    const tasks = [
        {
            id: 1,
            title: 'task title',
            dueDate: '2023-06-07 01:17:02',
            author: 'Patric',
            status: consts.TASK_DEFAULT_STATUSES.todo,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
        {
            id: 2,
            title: 'task title2',
            dueDate: '2023-06-09 01:17:02',
            author: 'Sandy',
            status: consts.TASK_DEFAULT_STATUSES.in_progress,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
        {
            id: 3,
            title: 'task title3',
            dueDate: '2023-06-05 01:17:02',
            author: 'Bob',
            status: consts.TASK_DEFAULT_STATUSES.done,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
    ];

    const action = {
        type: consts.UPDATE_ALL_TASKS,
        payload: tasks,
    };

    const updatedState = taskReducer(Object.assign({}, initState), action);

    expect(updatedState).toEqual({
        ...initState,
        taskList: tasks,
    });
});

test('task reducer should add new task', () => {
    const taskList = [
        {
            id: 1,
            title: 'task title',
            dueDate: '2023-06-07 01:17:02',
            author: 'Patric',
            status: consts.TASK_DEFAULT_STATUSES.in_progress,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        }
    ];

    const newTask = {
        id: 3,
        title: 'Some title',
        dueDate: '2023-06-05 01:17:02',
        author: 'Squidward',
        status: consts.TASK_DEFAULT_STATUSES.todo,
        createdAt: '2023-06-03 01:17:02',
        updatedAt: '2023-06-03 01:17:02',
    };

    const action = {
        type: consts.ADD_TASK,
        payload: newTask,
    };

    const updatedState = taskReducer(
        Object.assign(
            {},
            initState,
            { taskList: [...taskList] }),
        action
    );

    expect(updatedState).toEqual({
        ...initState,
        taskList: [ ...taskList, newTask ],
    });
});

test('task reducer should update task', () => {
    const taskList = [
        {
            id: 1,
            title: 'task title',
            dueDate: '2023-06-07 01:17:02',
            author: 'Patric',
            status: consts.TASK_DEFAULT_STATUSES.in_progress,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
        {
            id: 5,
            title: 'Some title',
            dueDate: '2023-06-05 01:17:02',
            author: 'Squidward',
            status: consts.TASK_DEFAULT_STATUSES.todo,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        }
    ];

    const updatedTask = {
        id: 1,
        title: 'Some title updated',
        dueDate: '2023-06-05 01:17:02',
        author: 'Dean is new author',
        status: consts.TASK_DEFAULT_STATUSES.done,
        createdAt: '2023-06-03 01:17:02',
        updatedAt: '2023-06-03 01:17:02',
    };

    const action = {
        type: consts.UPDATE_TASK,
        payload: updatedTask,
    };

    const updatedState = taskReducer(
        Object.assign(
            {},
            initState,
            { taskList: [ ...taskList ] },
        ),
        action);

    // prepare new array with tasks - what we expect
    const expectedTaskList = [ ...taskList ];
    const index = expectedTaskList.findIndex((task) => task.id === action.payload.id);

    expectedTaskList[index] = action.payload;

    expect(updatedState).toEqual({
        ...initState,
        taskList: expectedTaskList,
    });
});

test('task reducer should delete task', () => {
    const taskList = [
        {
            id: 1,
            title: 'task title',
            dueDate: '2023-06-07 01:17:02',
            author: 'Patric',
            status: consts.TASK_DEFAULT_STATUSES.todo,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
        {
            id: 2,
            title: 'task title2',
            dueDate: '2023-06-09 01:17:02',
            author: 'Sandy',
            status: consts.TASK_DEFAULT_STATUSES.in_progress,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
        {
            id: 3,
            title: 'task title3',
            dueDate: '2023-06-05 01:17:02',
            author: 'Bob',
            status: consts.TASK_DEFAULT_STATUSES.done,
            createdAt: '2023-06-03 01:17:02',
            updatedAt: '2023-06-03 01:17:02',
        },
    ];

    const action = {
        type: consts.DELETE_TASK,
        payload: { id: 2 },
    };

    const updatedState = taskReducer(
        Object.assign(
            {},
            initState,
            { taskList: [...taskList] }),
        action
    );

    // prepare new array with tasks - what we expect
    const expectedTaskList = [ ...taskList ];
    const index = expectedTaskList.findIndex((task) => task.id === action.payload.id);

    expectedTaskList.splice(index, 1)

    expect(updatedState).toEqual({
        ...initState,
        taskList: expectedTaskList,
    });
});