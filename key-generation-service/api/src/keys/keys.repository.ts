import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { KeyEntity } from './entities/keys.entity';

export class KeysRepository {
  constructor(
    @InjectModel('keys')
    private readonly _keyEntity: Model<KeyEntity>,
  ) {}

  async getOne(): Promise<KeyEntity> {
    return await this._keyEntity.findOne();
  }

  async getMany(count: number): Promise<KeyEntity[]> {
    return await this._keyEntity.find().limit(count);
  }

  async findAll(): Promise<KeyEntity[]> {
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
