import { Server as HttpServer } from 'http';

import jwt from 'jsonwebtoken';
import { Server as SocketServer } from 'socket.io';

import logger from '../common/utils/logger.js';
import type { ITokenPayload } from '../modules/auth/auth.interface.js';

import config from './index.js';

/**
 * Socket.io events enumeration for type safety
 */
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  NOTIFICATION = 'notification',
  ROOM_JOIN = 'room:join',
  ROOM_LEAVE = 'room:leave',
}

let io: SocketServer;

/**
 * Initialize Socket.io
 * @param server HTTP server instance
 */
export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: config.client_url || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // JWT Authentication Middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as ITokenPayload;
      socket.data.user = decoded;
      next();
    } catch (err) {
      logger.error('Socket Auth Error:', err);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { id: userId, role } = socket.data.user as ITokenPayload;

    logger.info(`User connected to socket: ${userId} (${role})`);

    // Join personal room
    socket.join(`user_${userId}`);

    // Join global room
    socket.join('global');

    // Join admin room if applicable
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      socket.join('admin');
    }

    socket.on(SocketEvent.DISCONNECT, () => {
      logger.info(`User disconnected from socket: ${userId}`);
    });
  });

  return io;
};

/**
 * Get Socket.io instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

/**
 * Utility to emit to specific user
 */
export const emitToUser = (userId: string, event: string, data: unknown) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

/**
 * Utility to emit to admins
 */
export const emitToAdmins = (event: string, data: unknown) => {
  if (io) {
    io.to('admin').emit(event, data);
  }
};

/**
 * Utility to emit to everyone
 */
export const emitGlobal = (event: string, data: unknown) => {
  if (io) {
    io.to('global').emit(event, data);
  }
};
