import { Module } from '@nestjs/common';
import { RedisModule } from 'src/shared/redis/redis.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [RedisModule],
  providers: [EventsGateway],
})
export class EventsModule {}
