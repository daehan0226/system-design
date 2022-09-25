import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { KeysRepository } from './keys.repository';
import { UsedKeysRepository } from './used-keys.repository';

let keysInMemory: string[] = [];
const maxKeyCountInMemory = process.env.MAX_KEY_COUNT_IN_MEMORY
  ? Number(process.env.MAX_KEY_COUNT_IN_MEMORY)
  : 200;

@Injectable()
export class KeysService implements OnModuleInit {
  constructor(
    private readonly keysRepository: KeysRepository,
    private readonly usedKeysRepository: UsedKeysRepository,
  ) {}

  async onModuleInit() {
    await this.insertKeysToMemory();
  }

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
    const newkeys = await this.keysRepository.getMany(maxKeyCountInMemory);
    if (keysInMemory.length === 0) {
      console.log(
        `add new keys to memory and remove from keys collection and add to used collection`,
      );
      const keyList = newkeys.map((k) => k._id);
      this.keysRepository.remove(keyList);
      this.usedKeysRepository.save(newkeys);
      keysInMemory = keyList;
    } else {
      console.log(`did not update in memory`);
    }
  }

  async getKey() {
    const keyInMemoryCount = keysInMemory.length;
    if (keyInMemoryCount === 0) {
      await this.insertKeysToMemory();
    }
    return {
      key: keysInMemory.shift(),
      keyCountInMemory: keysInMemory.length,
    };
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

  async getKeyConfig() {
    const { size, count, avgObjSize } = await this.keysRepository.size();

    return {
      size,
      count,
      avgObjSize,
    };
  }

  async getUsedKeyConfig() {
    const { size, count, avgObjSize } = await this.usedKeysRepository.size();

    return {
      size,
      count,
      avgObjSize,
    };
  }

  async config() {
    return {
      keyColSize: await this.getKeyConfig(),
      usedKeyColSize: await this.getUsedKeyConfig(),
    };
  }

  async findAll() {
    return await this.keysRepository.findAll();
  }

  async getKeyCount() {
    return await this.keysRepository.count();
  }
}
