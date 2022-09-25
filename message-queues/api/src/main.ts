import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WorkerModule } from './worker/worker.module';

const port = process.env.NEST_PORT ? Number(process.env.NEST_PORT) : 3000;
const serviceType = process.env.SERVICE_TYPE ?? 'WAS';

async function bootstrap() {
  console.log(serviceType);
  console.log(port);
  let module = AppModule;
  if (serviceType === 'WORKER') {
    module = WorkerModule;
  }
  const app = await NestFactory.create(module);
  await app.listen(port);
}
bootstrap();
