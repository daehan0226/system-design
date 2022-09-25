import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('worker') private readonly workerQueue: Queue,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('task')
  async addTask() {
    console.log(`request arrived on ${process.env.SERVICE_TYPE}`);
    await this.workerQueue.add('task', {
      number: 10000,
    });
  }
}
