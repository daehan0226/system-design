import { Injectable } from '@nestjs/common';
import { RedisAdapter } from '@socket.io/redis-adapter';
import {
  REDIS_ROOM_NAME,
  REDIS_SESSION,
  REDIS_SOCKET_ROOM,
  REDIS_USER_NAME,
} from './constant';
import { Room } from './dto/room.dto';
import { User } from './dto/user.dto';
import { RedisService } from './redis.service';

@Injectable()
export class RedisManger {
  constructor(private readonly _redisService: RedisService) {}

  async createUserName(name: string, socketId: string, socket) {
    const userInRedis = await this._redisService.get(REDIS_USER_NAME(name));
    if (userInRedis && userInRedis.socketId) {
      console.log(`name ${name} already saved in redis`);
      const adapter: RedisAdapter = socket.adapter;
      const sockets = await adapter.allRooms();
      if (sockets.has(userInRedis.socketId)) {
        console.log(
          `socket id: ${userInRedis.socketId} is using name: ${name}`,
        );
        return false;
      }
    }
    const user = new User(socketId, name, false);
    await this._redisService.set(REDIS_USER_NAME(name), user);
    return true;
  }

  async getAllUsers(socketIds: string[]) {
    let data = [];
    for (const socketId of socketIds) {
      const socketData = await this._redisService.hget(REDIS_SESSION, socketId);
      if (socketData) {
        console.log(
          `get session data: ${socketId}, data: ${JSON.stringify(socketData)}`,
        );
        data.push(socketData);
      }
    }
    return data;
  }

  async getUser(socketId: string): Promise<User> {
    return await this._redisService.hget(REDIS_SESSION, socketId);
  }

  async addUser(socketId: string, name: string, isChatting: boolean) {
    const user = new User(socketId, name, isChatting);
    await this._redisService.hset(REDIS_SESSION, socketId, user);
  }

  async updateUser(socketId: string, isChatting: boolean) {
    const user = await this._redisService.hget(REDIS_SESSION, socketId);
    user.isChatting = isChatting;
    await this._redisService.hset(REDIS_SESSION, socketId, user);
    return user;
  }

  async removeUser(socketId: string) {
    await this._redisService.hdel(REDIS_SESSION, socketId);
  }

  async createRoom(name: string, user: User): Promise<Room> {
    const roomInRedis = await this._redisService.get(REDIS_ROOM_NAME(name));
    if (roomInRedis && roomInRedis.name === name) {
      return null;
    }
    const room = new Room(name, user);
    await this._redisService.set(REDIS_ROOM_NAME(name), room);
    await this._redisService.set(REDIS_SOCKET_ROOM(user.socketId), room);
    return room;
  }

  async getRoom(name: string): Promise<Room> {
    return this._redisService.get(REDIS_ROOM_NAME(name));
  }

  async updateRoom(room: Room) {
    await this._redisService.set(REDIS_ROOM_NAME(room.name), room);
    await this._redisService.set(
      REDIS_SOCKET_ROOM(room.creater.socketId),
      room,
    );
  }

  async removeUserFromRoom(
    userSocketId: string,
    roomName: string,
  ): Promise<Room> {
    const room = await this.getRoom(roomName);
    const updatedRoom: Room = {
      ...room,
      users: room.users.filter((u) => u.socketId !== userSocketId),
    };
    await this.updateRoom(updatedRoom);
    return updatedRoom;
  }

  async getRoomBySocketId(name: string, socketId: string): Promise<Room> {
    return this._redisService.hget(REDIS_ROOM_NAME(name), socketId);
  }

  async getAllRooms(socketIds: string[]) {
    let result = [];
    for (const socketId of socketIds) {
      const room = await this._redisService.get(REDIS_SOCKET_ROOM(socketId));
      if (room) {
        result.push(room);
      }
    }
    return result;
  }
}
