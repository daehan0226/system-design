import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { OneLetterKeysService } from './one-letter-keys.service';

@Controller('one-letter-keys')
export class OneLetterKeysController {
  constructor(private readonly keysService: OneLetterKeysService) {}

  @Post()
  async create(@Body() createKeyDto: CreateKeyDto) {
    return await this.keysService.create(createKeyDto);
  }

  @Post('init')
  async insertKeys() {
    return await this.keysService.insertMany();
  }

  @Get()
  async findAll() {
    return await this.keysService.findAll();
  }

  @Get('config')
  async config() {
    return await this.keysService.config();
  }

  @Get('count')
  async getKeyCount() {
    return await this.keysService.getKeyCount();
  }
}
