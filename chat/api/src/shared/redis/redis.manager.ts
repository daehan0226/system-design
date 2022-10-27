import { Injectable } from '@nestjs/common';
import { RedisAdapter } from '@socket.io/redis-adapter';
import { REDIS_SESSION, REDIS_USER_NAME } from './constant';
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
    const user = new User(socketId, name);
    await this._redisService.set(REDIS_USER_NAME(name), user);
    return true;
  }

  async getAllUserNames(socketIds: string[]) {
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

  async addUser(socketId: string, name: string) {
    const user = new User(socketId, name);
    await this._redisService.hset(REDIS_SESSION, socketId, user);
  }

  async removeUser(socketId: string) {
    console.log(`remove session id: ${socketId}`);
    await this._redisService.hdel(REDIS_SESSION, socketId);
  }
}
