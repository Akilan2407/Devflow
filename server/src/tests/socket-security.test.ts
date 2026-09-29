import { createServer, type Server as HttpServer } from 'node:http';
import { io as connectSocket, type Socket } from 'socket.io-client';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { createSocketServer } from '../sockets/socket.server.js';
import { app } from './test-utils.js';
import { registerUser, setupDatabase } from './test-utils.js';

setupDatabase();
let httpServer: HttpServer;
let port: number;

beforeAll(async () => {
  httpServer = createServer(app);
  createSocketServer(httpServer);
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  port = (httpServer.address() as { port: number }).port;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
});

const closeSocket = async (socket: Socket): Promise<void> => {
  await new Promise<void>((resolve) => { socket.once('disconnect', () => resolve()); socket.disconnect(); });
};

describe('Socket.IO authorization', () => {
  it('rejects unauthenticated connections', async () => {
    const socket = connectSocket(`http://127.0.0.1:${port}`, { autoConnect: false });
    const error = await new Promise<Error>((resolve) => { socket.once('connect_error', resolve); socket.connect(); });
    expect(error.message).toBe('Authentication required');
    socket.close();
  });

  it('rejects unauthorized room joins', async () => {
    const user = await registerUser('Socket User', 'socket@example.com');
    const socket = connectSocket(`http://127.0.0.1:${port}`, { auth: { token: user.token } });
    await new Promise<void>((resolve) => socket.once('connect', () => resolve()));
    const result = await new Promise<{ ok: boolean; message?: string }>((resolve) => socket.emit('join-room', 'organization:000000000000000000000000', resolve));
    expect(result).toEqual({ ok: false, message: 'Room access denied' });
    await closeSocket(socket);
  });
});
