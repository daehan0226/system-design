import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { Key } from './entities/key.entity';
import { UsedKey } from './entities/usedKey.entity';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(Key)
    private keysRepository: Repository<Key>,
    @InjectRepository(UsedKey)
    private usedkeysRepository: Repository<UsedKey>,
  ) {}

  async create(createKeyDto: CreateKeyDto) {
    try {
      return await this.keysRepository.save(createKeyDto);
    } catch {
      return;
    }
  }

  async findAll() {
    return await this.keysRepository.find();
  }

  async getKeyCount() {
    return await this.keysRepository.countBy({});
  }

  findOne(id: number) {
    return `This action returns a #${id} key`;
  }

  update(id: number, updateKeyDto: UpdateKeyDto) {
    return `This action updates a #${id} key`;
  }

  remove(id: number) {
    return `This action removes a #${id} key`;
  }
}
