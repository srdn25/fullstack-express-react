import { Moment } from 'moment';
import * as consts from '../../utils/consts';

export interface ITaskBase {
    title: string;
    description?: string | null;
    dueDate: string|Moment;
    author: string;
    status?: string;
}

export interface ITask extends ITaskBase {
    id: number;
    status: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ITaskUpdate {
    title?: string;
    description?: string;
    dueDate?: string;
    author?: string;
    status?: string;
}

interface IState {
    taskList: ITask[],
}

export const initState: IState = {
    taskList: [],
}

export function taskReducer (state: IState = initState, action: any): IState {
    switch (action.type) {
        case consts.UPDATE_ALL_TASKS:
            if (Array.isArray(action.payload)) {
                return {
                    ...state,
                    taskList: action.payload,
                }
            }
            return state;

        case consts.UPDATE_TASK:
            if (Array.isArray(action.payload)) {
                return state;
            }

            const updateIndex = state.taskList.findIndex((task) => !Array.isArray(action.payload) && task.id === action.payload.id);

            const newState = { ...state };
            if (updateIndex !== -1) {
                newState.taskList[updateIndex] = action.payload;
            }

            return newState;

        case consts.ADD_TASK:
            if (Array.isArray(action.payload)) {
                return state;
            }

            const alreadyExist = state.taskList.find((task) => task.id === action.payload.id);

            if (alreadyExist) {
                return state;
            }

            return {
                ...state,
                taskList: [
                    ...state.taskList,
                    action.payload,
                ]
            };

        case consts.DELETE_TASK:
            if (Array.isArray(action.payload)) {
                return state;
            }

            const deleteIndex = state.taskList.findIndex((task) => !Array.isArray(action.payload) && task.id === action.payload.id);

            if (deleteIndex === -1) {
                return state;
            }

            const newTaskList = [ ...state.taskList ];

            newTaskList.splice(deleteIndex, 1);

            return {
                ...state,
                taskList: newTaskList,
            };

        default:
            return state;
    }
}