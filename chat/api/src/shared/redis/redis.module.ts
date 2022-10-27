import { Module } from '@nestjs/common';
import { redisProviders } from './redis.providers';
import { RedisService } from './redis.service';

@Module({
  exports: [...redisProviders, RedisService],
  providers: [...redisProviders, RedisService],
})
export class RedisModule {}
