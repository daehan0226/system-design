export const REDIS_USER_NAME = (name: string): string => `USER:${name}`;
export const REDIS_ROOM_NAME = (name: string): string => `ROOM:${name}`;
export const REDIS_SOCKET_ROOM = (socketId: string): string =>
  `SOCKET:${socketId}`;
export const REDIS_SESSION = 'REDIS_SESSION';
