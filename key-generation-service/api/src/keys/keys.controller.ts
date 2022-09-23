import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  async create(@Body() createKeyDto: CreateKeyDto) {
    return await this.keysService.create(createKeyDto);
  }

  @Post('init')
  async insertKeys() {
    return await this.keysService.insertMany();
  }

  @Get('used')
  async getUsedKeys() {
    return await this.keysService.getUsedKeys();
  }

  @Get()
  async getKey() {
    return await this.keysService.getKey();
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
