import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeysModule } from './keys/keys.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://kgs:kgs@localhost:10002', {
      dbName: 'kgs',
    }),
    KeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
