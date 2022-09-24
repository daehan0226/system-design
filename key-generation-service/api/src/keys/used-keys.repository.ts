import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsedKeyEntity } from './entities/used-keys.entity';

export class UsedKeysRepository {
  constructor(
    @InjectModel('usedKeys')
    private readonly _keyEntity: Model<UsedKeyEntity>,
  ) {}

  async save(keys) {
    await this._keyEntity.insertMany(keys);
  }

  async getAll() {
    return await this._keyEntity.find();
  }

  async size(): Promise<any> {
    return await this._keyEntity.collection.stats();
  }
}
