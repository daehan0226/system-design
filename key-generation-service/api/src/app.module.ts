import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysModule } from './keys/keys.module';
import { Key } from './keys/entities/key.entity';
import { UsedKey } from './keys/entities/usedKey.entity';

const host = process.env.MYSQL ?? 'localhost';
const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 10001;
const database = process.env.MYSQL_DATABASE ?? 'kgs';
const password = process.env.MYSQL_PASSWORD ?? 'kgs';
const username = 'root';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      entities: [Key, UsedKey],
      synchronize: true,
    }),
    KeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
