import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovilesService } from './moviles.service';
import { CreateMovileDto } from './dto/create-movile.dto';
import { UpdateMovileDto } from './dto/update-movile.dto';

@Controller('moviles')
export class MovilesController {
  constructor(private readonly movilesService: MovilesService) {}

  @Post()
  create(@Body() createMovileDto: CreateMovileDto) {
    return this.movilesService.create(createMovileDto);
  }

  @Get()
  findAll() {
    return this.movilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovileDto: UpdateMovileDto) {
    return this.movilesService.update(id, updateMovileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movilesService.remove(id);
  }
}
