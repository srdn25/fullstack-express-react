import * as consts from '../../utils/consts';
import { ITask } from '../reducer/task';
import { AnyAction } from '@reduxjs/toolkit';

export function getAllTasks(payload: ITask[]): AnyAction {
    return {
        type: consts.UPDATE_ALL_TASKS,
        payload,
    };
}

export function deleteTask(payload: { id: number }): AnyAction {
    return {
        type: consts.DELETE_TASK,
        payload,
    };
}

export function updateTask(payload: ITask): AnyAction {
    return {
        type: consts.UPDATE_TASK,
        payload,
    };
}

export function addTask(payload: ITask): AnyAction {
    return {
        type: consts.ADD_TASK,
        payload,
    };
}