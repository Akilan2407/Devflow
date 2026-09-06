import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';

const socketUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(/\/api\/?$/, '');
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  socket ??= io(socketUrl, { autoConnect: false, transports: ['websocket'] });
  socket.auth = { token: useAuthStore.getState().accessToken };
  if (!socket.connected) socket.connect();
  return socket;
};
