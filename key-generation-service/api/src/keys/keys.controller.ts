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
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  async create(@Body() createKeyDto: CreateKeyDto) {
    return await this.keysService.create(createKeyDto);
  }

  @Get()
  async findAll() {
    return await this.keysService.findAll();
  }

  @Get('count')
  async getKeyCount() {
    return await this.keysService.getKeyCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.keysService.update(+id, updateKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keysService.remove(+id);
  }
}
