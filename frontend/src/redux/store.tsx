import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import { Socket } from '../services/Socket';
import { socketMiddleware } from '../middleware/socket';
import { taskReducer } from './reducer/task';
import { socketReducer } from './reducer/socket';
import { notificationReducer } from './reducer/notification';

const socket = new Socket();

// @ts-ignore
export const store = configureStore({
    reducer: {
        task: taskReducer,
        socket: socketReducer,
        notification: notificationReducer,
    },
    middleware: [
        socketMiddleware(socket),
    ],
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
export type AsyncAction = (dispatch: (action: Action) => any) => void;

