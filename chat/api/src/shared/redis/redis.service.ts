import { Injectable, Inject } from '@nestjs/common';
import { RedisClient, REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  async set(key: string, value: any) {
    return await this.redisClient.set(key, value);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
