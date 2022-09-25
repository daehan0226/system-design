import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { config } from 'src/config.service';
import { WorkerController } from './worker.controller';
import { WorkerProcessor } from './worker.processor';

const { redisHost, redisPort, queueName } = config();

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: redisHost,
        port: redisPort,
      },
    }),
    BullModule.registerQueue({
      name: queueName,
    }),
  ],
  controllers: [WorkerController],
  providers: [WorkerProcessor],
})
export class WorkerModule {}
