import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';
import { Auth } from 'src/auth/decorators';

@Controller('mechanics')
@Auth()
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Post()
  create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicsService.create(createMechanicDto);
  }

  @Get()
  findAll() {
    return this.mechanicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.mechanicsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() updateMechanicDto: UpdateMechanicDto,
  ) {
    return this.mechanicsService.update(id, updateMechanicDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.mechanicsService.remove(id);
  }
}
