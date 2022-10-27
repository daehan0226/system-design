import { Module } from '@nestjs/common';
import { RedisManger } from './redis.manager';
import { redisProviders } from './redis.providers';
import { RedisService } from './redis.service';

@Module({
  exports: [...redisProviders, RedisService, RedisManger],
  providers: [...redisProviders, RedisService, RedisManger],
})
export class RedisModule {}
