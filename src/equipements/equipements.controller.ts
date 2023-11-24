import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { EquipementsService } from './equipements.service';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Controller('equipements')
export class EquipementsController {
  constructor(private readonly equipementsService: EquipementsService) {}

  @Post()
  async create(@Body() createEquipementDto: CreateEquipementDto) {
    return await this.equipementsService.create(createEquipementDto);
  }

  @Get()
  async findAll() {
    return await this.equipementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUuidPipe) id: string) {
    return await this.equipementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() updateEquipementDto: UpdateEquipementDto,
  ) {
    return this.equipementsService.update(id, updateEquipementDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.equipementsService.remove(id);
  }
}
