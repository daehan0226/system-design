import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { keySchema } from './entities/keys.entity';
import { KeysRepository } from './keys.repository';

import { twoLetterKeySchema } from './entities/two-letter-keys.entity';
import { TwoLetterKeysService } from './two-letter-keys.service';
import { TwoLetterKeysController } from './two-letter-keys.controller';
import { TwoLetterKeysRepository } from './two-letter-keys.repository';
import { oneLetterKeySchema } from './entities/one-letter-keys.entity';
import { OneLetterKeysController } from './one-letter-keys.controller';
import { OneLetterKeysService } from './one-letter-keys.service';
import { OneLetterKeysRepository } from './one-letter-keys.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'keys',
        schema: keySchema,
      },
      {
        name: 'twoLetterKeys',
        schema: twoLetterKeySchema,
      },
      {
        name: 'oneLetterKeys',
        schema: oneLetterKeySchema,
      },
    ]),
  ],
  controllers: [
    KeysController,
    TwoLetterKeysController,
    OneLetterKeysController,
  ],
  providers: [
    KeysService,
    KeysRepository,
    TwoLetterKeysService,
    TwoLetterKeysRepository,
    OneLetterKeysService,
    OneLetterKeysRepository,
  ],
})
export class KeysModule {}
