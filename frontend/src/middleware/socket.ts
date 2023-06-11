import { Socket } from '../services/Socket';
import * as consts from '../utils/consts';
import { AppDispatch, RootState } from '../redux/store';
import { fromStringToJson } from '../utils/lib';
import { getAllTasks } from '../redux/action/task';
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

                                dispatch(newSocketConnection(socket));
                            });

                            socket.on('message', (event: any) => {
                                if (event.data) {
                                    const data: { type: string, method: string, payload: ITask[] } = fromStringToJson(event.data);

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.read && data.type === WEBSOCKET_MESSAGE_TYPES.send) {
                                        dispatch(getAllTasks(data.payload));
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