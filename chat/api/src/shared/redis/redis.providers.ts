import Redis from 'ioredis';
import { Provider } from '@nestjs/common';

export type RedisClient = Redis;
export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProviders: Provider[] = [
  {
    useFactory: () =>
      new Redis({
        host: 'redis',
        port: 6379,
      }),
    provide: REDIS_CLIENT,
  },
];
