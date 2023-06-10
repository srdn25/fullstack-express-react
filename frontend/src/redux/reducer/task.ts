import { Moment } from 'moment';
import * as consts from '../../utils/consts';
import { convertReadableStatusesToServerEnum } from '../../utils/lib';

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

interface IState {
    taskList: ITask[],
}

export const initState: IState = {
    taskList: [],
}

export function taskReducer (state: IState = initState, action: consts.IAction<string, any>): IState {
    switch (action.type) {
        case consts.UPDATE_ALL_TASKS:
            return {
                ...state,
                taskList: action.payload,
            }

        case consts.UPDATE_TASK:
            if (!action?.payload?.id) {
                return state;
            }

            const updateIndex = state.taskList.findIndex((task) => task.id === action.payload.id);

            const newState = { ...state };
            if (updateIndex !== -1) {
                newState.taskList[updateIndex] = action.payload;
            }

            return newState;

        case consts.ADD_TASK:
            return {
                ...state,
                taskList: [
                    ...state.taskList,
                    action.payload,
                ]
            };

        case consts.DELETE_TASK:
            if (!action.payload?.id) {
                return state;
            }

            const deleteIndex = state.taskList.findIndex((task) => task.id === action.payload.id);

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