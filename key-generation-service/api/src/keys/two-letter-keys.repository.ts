import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TwoLetterKeyEntity } from './entities/two-letter-keys.entity';

export class TwoLetterKeysRepository {
  constructor(
    @InjectModel('twoLetterKeys')
    private readonly _keyEntity: Model<TwoLetterKeyEntity>,
  ) {}

  async getOne(): Promise<TwoLetterKeyEntity> {
    return await this._keyEntity.findOne();
  }

  async findAll(): Promise<TwoLetterKeyEntity[]> {
    return await this._keyEntity.find();
  }

  async size(): Promise<any> {
    return await this._keyEntity.collection.stats();
  }

  async count(): Promise<number> {
    return await this._keyEntity.countDocuments();
  }

  async create(key: string) {
    return await this._keyEntity.create({ _id: key });
  }
}
