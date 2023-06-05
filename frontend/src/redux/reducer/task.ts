import * as consts from '../../utils/consts';

export interface ITask {
    id: number;
    title: string;
    description?: string | null;
    dueDate: string;
    author: string;
    // @ts-ignore
    status: consts.TASK_DEFAULT_STATUSES.todo | consts.TASK_DEFAULT_STATUSES.inProgress | consts.TASK_DEFAULT_STATUSES.done;
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
            if (action.payload) {
                state.taskList = action.payload;
            }

            return state;

        case consts.UPDATE_TASK:
            if (action?.payload?.id) {
                const index = state.taskList.findIndex((task) => task.id === action.payload.id);

                if (index !== -1) {
                    state.taskList[index] = action.payload;
                }
            }

            return state;

        case consts.ADD_TASK:
            if (action.payload) {
                state.taskList.push(action.payload);
            }

            return state;

        case consts.DELETE_TASK:
            if (action.payload?.id) {
                const index = state.taskList.findIndex((task) => task.id === action.payload.id);

                if (index !== -1) {
                    state.taskList.splice(index, 1);
                }
            }

            return state;

        case consts.UPDATE_ALLOWED_STATUSES:
            if (action.payload) {
                state.allowedStatus = action.payload;
            }

            return state;

        default:
            return state;
    }
}