import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { KeysRepository } from './keys.repository';
import { UsedKeysRepository } from './used-keys.repository';

let keysInMemory: string[] = [];

@Injectable()
export class KeysService {
  constructor(
    private readonly keysRepository: KeysRepository,
    private readonly usedKeysRepository: UsedKeysRepository,
  ) {}
  async create(dto: CreateKeyDto) {
    try {
      return await this.keysRepository.create(dto.key);
    } catch {
      return;
    }
  }

  async getUsedKeys() {
    return await this.usedKeysRepository.getAll();
  }

  async insertKeysToMemory() {
    const keys = await this.keysRepository.getMany(100);
    await this.usedKeysRepository.save(
      keys.map((k) => {
        return {
          _id: k._id,
        };
      }),
    );
    keysInMemory = keys.map((k) => k._id);
  }

  async getKey() {
    const keyInMemoryCount = keysInMemory.length;
    if (keyInMemoryCount === 0) {
      await this.insertKeysToMemory();
    }
    console.log(`key in memory count: ${keyInMemoryCount}`);
    return keysInMemory.pop();
  }

  generate() {
    const letterList = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];

    const result = [];
    for (const i of letterList) {
      for (const j of letterList) {
        for (const k of letterList) {
          result.push(`${i}${j}${k}`);
        }
      }
    }
    return result;
  }

  async insertMany() {
    const keys = this.generate();
    for (const key of keys) {
      try {
        console.log(key);
        await this.keysRepository.create(key);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async config() {
    return {
      keyColSize: await this.keysRepository.size(),
    };
  }

  async findAll() {
    return await this.keysRepository.findAll();
  }

  async getKeyCount() {
    return await this.keysRepository.count();
  }
}
