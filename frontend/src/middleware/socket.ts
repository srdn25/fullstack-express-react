import { Socket } from '../utils/Socket';
import * as consts from '../utils/consts';
import { AppDispatch, RootState } from '../redux/store';

export const socketMiddleware =
    (socket: Socket): any =>
        (params: { dispatch: AppDispatch, getState: () => RootState }) =>
            (next: Function) =>
                (action: { type: string, payload: object }) => {
                    // const { dispatch, getState } = params
                    const { type } = action

                    switch (type) {
                        case 'socket/connect':
                            socket.connect('ws://localhost:3155');

                            socket.on('open', (event) => {
                                console.log('Connected to websocket');
                                socket.send({
                                    user: 'Sam',
                                    method: consts.WEBSOCKET_MESSAGE_METHODS.read,
                                    type: consts.WEBSOCKET_MESSAGE_TYPES.send,
                                    where: '*',
                                });
                            });

                            socket.on('message', (event) => {
                                console.log(event);
                            });

                            socket.on('close', (event) => {
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