import { Socket } from '../services/Socket';
import * as consts from '../utils/consts';
import { AppDispatch, RootState } from '../redux/store';
import { fromStringToJson } from '../utils/lib';
import { getAllTasks, deleteTask, updateTask, addTask } from '../redux/action/task';
import { newSocketConnection } from '../redux/action/socket';
import { WEBSOCKET_MESSAGE_METHODS, WEBSOCKET_MESSAGE_TYPES } from '../utils/consts';
import { ITask } from '../redux/reducer/task';

export const socketMiddleware =
    (socket: Socket): any =>
        (params: { dispatch: AppDispatch, getState: () => RootState }) =>
            (next: Function) =>
                (action: { type: string, payload: object }) => {
                    const { dispatch } = params
                    const { type } = action

                    switch (type) {
                        case 'socket/connect':
                            socket.connect('ws://localhost:3155');

                            socket.on('open', () => {
                                console.log('Connected to websocket');
                                socket.send({
                                    user: 'Sam',
                                    method: consts.WEBSOCKET_MESSAGE_METHODS.read,
                                    type: consts.WEBSOCKET_MESSAGE_TYPES.send,
                                    where: '*',
                                });
                                socket.send({
                                    user: 'FrontEnd',
                                    method: consts.WEBSOCKET_MESSAGE_METHODS.create,
                                    type: consts.WEBSOCKET_MESSAGE_TYPES.subscribe,
                                });
                                socket.send({
                                    user: 'FrontEnd',
                                    method: consts.WEBSOCKET_MESSAGE_METHODS.update,
                                    type: consts.WEBSOCKET_MESSAGE_TYPES.subscribe,
                                });
                                socket.send({
                                    user: 'FrontEnd',
                                    method: consts.WEBSOCKET_MESSAGE_METHODS.delete,
                                    type: consts.WEBSOCKET_MESSAGE_TYPES.subscribe,
                                });

                                dispatch(newSocketConnection(socket));
                            });

                            socket.on('message', (event: any) => {
                                if (event.data) {
                                    const data: { type: string, method: string, payload: ITask[]|ITask } = fromStringToJson(event.data);

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.read && data.type === WEBSOCKET_MESSAGE_TYPES.send && Array.isArray(data.payload)) {
                                        dispatch(getAllTasks(data.payload));
                                    }

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.create && data.type === WEBSOCKET_MESSAGE_TYPES.subscribe && !Array.isArray(data.payload)) {
                                        if (data.payload.id) {
                                            dispatch(addTask(data.payload));
                                        }
                                    }

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.update && data.type === WEBSOCKET_MESSAGE_TYPES.subscribe && !Array.isArray(data.payload)) {
                                        if (data.payload.id) {
                                            dispatch(updateTask(data.payload));
                                        }
                                    }

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.delete && data.type === WEBSOCKET_MESSAGE_TYPES.subscribe && !Array.isArray(data.payload)) {
                                        if (data.payload.id) {
                                            dispatch(deleteTask(data.payload));
                                        }
                                    }
                                }
                            });

                            socket.on('close', () => {
                                console.log('Websocket disconnected');
                            });

                            break;

                        case 'socket/disconnect':
                            socket.disconnect();
                            break;

                        default:
                            break
                    }

                    return next(action);
}