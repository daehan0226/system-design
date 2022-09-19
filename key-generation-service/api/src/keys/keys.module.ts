import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './entities/key.entity';
import { UsedKey } from './entities/usedKey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Key, UsedKey])],
  controllers: [KeysController],
  providers: [KeysService],
})
export class KeysModule {}
