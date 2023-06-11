import { convertReadableStatusesToServerEnum } from './lib';

export const UPDATE_ALL_TASKS: string = 'UPDATE_ALL_TASKS';

export const UPDATE_TASK: string = 'UPDATE_TASK';

export const DELETE_TASK: string = 'DELETE_TASK';

export const ADD_TASK: string = 'ADD_TASK';

export const SET_NEW_SOCKET: string = 'SET_NEW_SOCKET';

export const SET_ERROR: string = 'SET_ERROR';

export const TASK_DEFAULT_STATUSES_READABLE: { [k: string]: string } = {
    in_progress: 'In Progress',
    done: 'Done',
    todo: 'Todo',
};

export const TASK_DEFAULT_STATUSES = convertReadableStatusesToServerEnum(TASK_DEFAULT_STATUSES_READABLE);

export const WEBSOCKET_MESSAGE_TYPES = {
    subscribe: 'subscribe',
    send: 'send',
};

export const WEBSOCKET_MESSAGE_METHODS = {
    create: 'create',
    read: 'read',
    update: 'update',
    delete: 'delete',
};

// in ms
export const HTTP_REQUEST_TIMEOUT: number = 1000;