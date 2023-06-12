import * as consts from '../../utils/consts';
import { AnyAction } from '@reduxjs/toolkit';

interface IState {
    error: null|string,
    message: null|string,
}

export const initState: IState = {
    error: null,
    message: null,
}

export function notificationReducer (state: IState = initState, action: AnyAction): IState {
    switch (action.type) {
        case consts.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }

        case consts.SET_NOTIFICATION:
            return {
                ...state,
                message: action.payload,
            }

        default:
            return state;
    }
}