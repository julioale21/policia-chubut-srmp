import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SparePartService } from './spare_part.service';
import { CreateSparePartDto } from './dto/create-spare_part.dto';
import { UpdateSparePartDto } from './dto/update-spare_part.dto';

@Controller('spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) {}

  @Post()
  create(@Body() createSparePartDto: CreateSparePartDto) {
    return this.sparePartService.create(createSparePartDto);
  }

  @Get()
  findAll() {
    return this.sparePartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sparePartService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSparePartDto: UpdateSparePartDto,
  ) {
    return this.sparePartService.update(id, updateSparePartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sparePartService.remove(id);
  }
}
