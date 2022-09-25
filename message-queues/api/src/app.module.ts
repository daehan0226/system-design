import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config.service';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
