import {io, Socket} from 'socket.io-client';
import {BASE_URL} from '../constant/constants';

const socket = io(BASE_URL, {
  autoConnect: true,
  transports: ['websocket'],
});

const socketChat = io(`${BASE_URL}chat`, {
  autoConnect: true,
  transports: ['websocket'],
});

const socketPost = io(`${BASE_URL}post`, {
  autoConnect: true,
  transports: ['websocket'],
});

export {socket, socketChat, socketPost};
