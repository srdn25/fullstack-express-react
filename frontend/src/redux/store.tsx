import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { Socket } from '../utils/Socket';
import { socketMiddleware } from '../middleware/socket';
import { taskReducer } from './reducer/task';

const socket = new Socket();

export const store = configureStore({
    reducer: {
        task: taskReducer,
    },
    middleware: [
        socketMiddleware(socket),
    ],
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
