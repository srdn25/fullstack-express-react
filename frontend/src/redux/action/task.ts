import * as consts from '../../utils/consts';
import { useAppDispatch } from '../hooks';
import { ITask } from '../reducer/task';

export function getAllTasks(payload: any) {
    const action = {
        type: consts.UPDATE_ALL_TASKS,
        payload,
    };

    return useAppDispatch(action);
}

export function deleteTask(payload: { id: number }) {
    const action = {
        type: consts.DELETE_TASK,
        payload,
    };

    return useAppDispatch(action);
}

export function updateTask(payload: ITask) {
    const action = {
        type: consts.UPDATE_TASK,
        payload,
    };

    return useAppDispatch(action);
}

export function addTask(payload: ITask) {
    const action = {
        type: consts.ADD_TASK,
        payload,
    };

    return useAppDispatch(action);
}