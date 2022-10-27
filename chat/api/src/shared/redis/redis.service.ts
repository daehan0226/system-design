import { Injectable, Inject } from '@nestjs/common';
import { RedisClient, REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  async set(key: string, value: any) {
    return await this.redisClient.set(key, JSON.stringify(value));
  }

  async get(key: string) {
    const res = await this.redisClient.get(key);
    return JSON.parse(res);
  }

  async hset(key: string, field: string, value: any) {
    return await this.redisClient.hset(key, field, JSON.stringify(value));
  }

  async hget(key: string, field: string) {
    const res = await this.redisClient.hget(key, field);
    return JSON.parse(res);
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }

  async hdel(key: string, field: string) {
    return await this.redisClient.hdel(key, field);
  }
}
