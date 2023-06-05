import { Socket } from '../utils/Socket';
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