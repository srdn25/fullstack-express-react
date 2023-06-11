import * as consts from '../../utils/consts';

export function setGlobalError(payload: string|null) {
    return {
        type: consts.SET_ERROR,
        payload,
    }
}
