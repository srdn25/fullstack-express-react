import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { Socket } from '../utils/Socket';
import { socketMiddleware } from '../middleware/socket';

export const store = configureStore({
    reducer: {},
    middleware: [
        socketMiddleware(new Socket()),
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