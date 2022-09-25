import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('worker')
export class WorkerProcessor {
  private readonly logger = new Logger(WorkerProcessor.name);

  @Process('task')
  handleTask(job: Job) {
    this.logger.debug(`Start job on ${process.env.SERVICE_TYPE}`);
    const time = performance.now();
    let count = 0;
    while (count < job.data.number) {
      count++;
    }
    this.logger.debug(`job completed: ${performance.now() - time}`);
  }
}
