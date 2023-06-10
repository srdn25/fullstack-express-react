import * as consts from '../../utils/consts';

import {
    ISocketActionPayloadDeleteTask,
    ISocketActionPayloadNewTask,
    ISocketActionPayloadUpdateTask
} from '../reducer/socket';
import { AppThunk } from '../store';
import { Socket } from '../../utils/Socket';

export function newSocketConnection(payload: Socket) {
    return {
        type: consts.SET_NEW_SOCKET,
        payload,
    }
}

export function createNewTask(payload: ISocketActionPayloadNewTask): AppThunk {
    return function (dispatch, getState) {
        const socket = getState().socket.connection;

        const prepareSaveData = {
            user: payload.user,
            method: consts.WEBSOCKET_MESSAGE_METHODS.delete,
            type: consts.WEBSOCKET_MESSAGE_TYPES.send,
            payload,
        }

        socket.send(prepareSaveData);
    }
}

export function updateTask(payload: ISocketActionPayloadUpdateTask): AppThunk {
    return function (dispatch, getState) {
        const socket = getState().socket.connection;

        const prepareDeleteData = {
            user: payload.user,
            method: consts.WEBSOCKET_MESSAGE_METHODS.delete,
            type: consts.WEBSOCKET_MESSAGE_TYPES.send,
            payload,
        }

        socket.send(prepareDeleteData);
    }
}

export function deleteTask(payload: ISocketActionPayloadDeleteTask): AppThunk {
    return function (dispatch, getState) {
        const socket = getState().socket.connection;

        const prepareDeleteData = {
            user: payload.user,
            method: consts.WEBSOCKET_MESSAGE_METHODS.delete,
            type: consts.WEBSOCKET_MESSAGE_TYPES.send,
            payload,
        }

        socket.send(prepareDeleteData);
    }
}