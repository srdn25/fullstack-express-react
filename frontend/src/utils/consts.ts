import { convertReadableStatusesToServerEnum } from './lib';

export const UPDATE_ALL_TASKS = 'UPDATE_ALL_TASKS';

export const UPDATE_TASK = 'UPDATE_TASK';

export const DELETE_TASK = 'DELETE_TASK';

export const ADD_TASK = 'ADD_TASK';

export const SET_NEW_SOCKET = 'SET_NEW_SOCKET';

export const SAVE_TASK_BY_SOCKET = 'SAVE_TASK_BY_SOCKET';

export const DELETE_TASK_BY_SOCKET = 'DELETE_TASK_BY_SOCKET';

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

export interface IAction<T, P> {
    readonly type: T;
    readonly payload: P;
}