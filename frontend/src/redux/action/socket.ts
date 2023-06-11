import * as consts from '../../utils/consts';
import { Socket } from '../../services/Socket';

export function newSocketConnection(payload: Socket) {
    return {
        type: consts.SET_NEW_SOCKET,
        payload,
    }
}
