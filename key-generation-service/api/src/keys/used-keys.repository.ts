import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsedKeyEntity } from './entities/used-keys.entity';

export class UsedKeysRepository {
  constructor(
    @InjectModel('usedKeys')
    private readonly _keyEntity: Model<UsedKeyEntity>,
  ) {}

  async save(keys) {
    for (const key of keys) {
      try {
        await this._keyEntity.create(key);
      } catch (e) {}
    }
  }

  async getAll() {
    return await this._keyEntity.find();
  }
}
