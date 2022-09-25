import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('worker')
export class WorkerController {
  constructor(@InjectQueue('worker') private readonly workerQueue: Queue) {}

  @Post('task')
  async addTask() {
    console.log(`request arrived on ${process.env.SERVICE_TYPE}`);
    await this.workerQueue.add('task', {
      number: 10000,
    });
  }
}
