import { Socket } from '../../services/Socket';
import * as consts from '../../utils/consts';
import { ITaskBase } from './task';
import { Moment } from 'moment/moment';
import { AnyAction } from '@reduxjs/toolkit';

export interface ISocketActionPayloadNewTask extends ITaskBase {
    user: string,
    dueDate: string;
}

export interface ISocketActionPayloadDeleteTask {
    user: string,
    id: number,
}

export interface ISocketActionPayloadUpdateTask {
    id: number,
    title?: string;
    description?: string | null;
    dueDate?: string;
    author?: string;
    status?: string;
    user: string;
}

interface IState {
    connection: Socket,
}

export const initState: IState = {
    connection: new Socket(),
}

export function socketReducer (state: IState = initState, action: AnyAction): IState {
    switch (action.type) {
        case consts.SET_NEW_SOCKET:
            return {
                ...state,
                connection: action.payload,
            }

        default:
            return state;
    }
}