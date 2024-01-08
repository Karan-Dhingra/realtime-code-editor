import {io} from 'socket.io-client'
import { SOCKET_BACKEND_URL } from '../constants';

export const initSocket = () => {
    const options = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket']
    }

    return io(SOCKET_BACKEND_URL, options)
}