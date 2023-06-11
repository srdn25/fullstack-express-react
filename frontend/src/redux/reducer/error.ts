import * as consts from '../../utils/consts';
import { AnyAction } from '@reduxjs/toolkit';

interface IState {
    error: null|string,
}

export const initState: IState = {
    error: null,
}

export function errorReducer (state: IState = initState, action: AnyAction): IState {
    switch (action.type) {
        case consts.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }

        default:
            return state;
    }
}