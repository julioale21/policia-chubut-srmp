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
import { MovilesService } from './moviles.service';
import { CreateMovileDto } from './dto/create-movile.dto';
import { UpdateMovileDto } from './dto/update-movile.dto';
import { Auth } from 'src/auth/decorators';

@Auth()
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovileDto: UpdateMovileDto,
  ) {
    return this.movilesService.update(id, updateMovileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.movilesService.remove(id);
  }
}
