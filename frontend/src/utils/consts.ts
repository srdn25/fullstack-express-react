export const UPDATE_ALL_TASKS = 'UPDATE_ALL_TASKS';
export const UPDATE_TASK = 'UPDATE_TASK';

export const DELETE_TASK = 'DELETE_TASK';

export const ADD_TASK = 'ADD_TASK';

export const UPDATE_ALLOWED_STATUSES = 'UPDATE_ALLOWED_STATUSES';

export const TASK_DEFAULT_STATUSES = {
    todo: 'todo',
    inProgress: 'in_progress',
    done: 'done',
};

export interface IAction<T, P> {
    readonly type: T;
    readonly payload?: P;
}