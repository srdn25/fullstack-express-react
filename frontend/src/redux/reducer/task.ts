import * as consts from '../../utils/consts';

export interface ITask {
    id: number;
    title: string;
    description?: string | null;
    dueDate: string;
    author: string;
    // @ts-ignore
    status: consts.TASK_DEFAULT_STATUSES.todo | consts.TASK_DEFAULT_STATUSES.in_progress | consts.TASK_DEFAULT_STATUSES.done;
    createdAt: string;
    updatedAt: string;
}

interface IState {
    taskList: ITask[],
    allowedStatus: object,
}

export const initState: IState = {
    taskList: [],
    allowedStatus: consts.TASK_DEFAULT_STATUSES,
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

        case consts.UPDATE_ALLOWED_STATUSES:
            return {
                ...state,
                allowedStatus: action.payload,
            };

        default:
            return state;
    }
}