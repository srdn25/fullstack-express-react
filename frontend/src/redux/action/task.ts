import * as consts from '../../utils/consts';
import { ITask } from '../reducer/task';

export function getAllTasks(payload: any) {
    return {
        type: consts.UPDATE_ALL_TASKS,
        payload,
    };
}

export function deleteTask(payload: { id: number }) {
    return {
        type: consts.DELETE_TASK,
        payload,
    };
}

export function updateTask(payload: ITask) {
    return {
        type: consts.UPDATE_TASK,
        payload,
    };
}

export function addTask(payload: ITask) {
    return {
        type: consts.ADD_TASK,
        payload,
    };
}