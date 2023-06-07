import { Socket } from '../utils/Socket';
import * as consts from '../utils/consts';
import { AppDispatch, RootState } from '../redux/store';
import { fromStringToJson } from '../utils/lib';
import { getAllTasks } from '../redux/action/task';
import { WEBSOCKET_MESSAGE_METHODS, WEBSOCKET_MESSAGE_TYPES } from '../utils/consts';

export const socketMiddleware =
    (socket: Socket): any =>
        (params: { dispatch: AppDispatch, getState: () => RootState }) =>
            (next: Function) =>
                (action: { type: string, payload: object }) => {
                    const { dispatch, getState } = params
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
                            });

                            socket.on('message', (event: any) => {
                                if (event.data) {
                                    const data = fromStringToJson(event.data);

                                    if (data && data.method === WEBSOCKET_MESSAGE_METHODS.read && data.type === WEBSOCKET_MESSAGE_TYPES.send && data.payload) {
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