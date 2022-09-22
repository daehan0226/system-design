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
