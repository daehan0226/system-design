import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OneLetterKeyEntity } from './entities/one-letter-keys.entity';

export class OneLetterKeysRepository {
  constructor(
    @InjectModel('oneLetterKeys')
    private readonly _keyEntity: Model<OneLetterKeyEntity>,
  ) {}

  async getOne(): Promise<OneLetterKeyEntity> {
    return await this._keyEntity.findOne();
  }

  async findAll(): Promise<OneLetterKeyEntity[]> {
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
