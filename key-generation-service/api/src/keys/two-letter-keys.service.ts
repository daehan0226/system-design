import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { TwoLetterKeysRepository } from './two-letter-keys.repository';

@Injectable()
export class TwoLetterKeysService {
  constructor(private readonly keysRepository: TwoLetterKeysRepository) {}
  async create(dto: CreateKeyDto) {
    try {
      return await this.keysRepository.create(dto.key);
    } catch {
      return;
    }
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
        result.push(`${i}${j}`);
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
