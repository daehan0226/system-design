import { Injectable } from '@nestjs/common';
import { REDIS_SESSION, REDIS_USER_NAME } from './constant';
import { RedisService } from './redis.service';

@Injectable()
export class RedisManger {
  constructor(private readonly _redisService: RedisService) {}

  async createUserName(name: string) {
    const exist = await this._redisService.get(REDIS_USER_NAME(name));
    if (exist === '1') {
      return false;
    }
    await this._redisService.set(REDIS_USER_NAME(name), 1);
    return true;
  }

  async getAllUserNames(socketIds: string[]) {
    let data = [];
    for (const socketId of socketIds) {
      const socketData = await this._redisService.hget(REDIS_SESSION, socketId);
      console.log(`get session data: ${socketId}, data: ${socketData}`);
      if (socketData) {
        data.push(socketData);
      }
    }
    return data;
  }

  async addUser(socketId: string, name: string) {
    await this._redisService.hset(REDIS_SESSION, socketId, {
      name,
    });
  }

  async removeUser(socketId: string) {
    console.log(`remove session id: ${socketId}`);
    await this._redisService.hdel(REDIS_SESSION, socketId);
  }
}
