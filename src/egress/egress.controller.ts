import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EgressService } from './egress.service';
import { CreateEgressDto } from './dto/create-egress.dto';
import { UpdateEgressDto } from './dto/update-egress.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';

@Controller('egress')
export class EgressController {
  constructor(private readonly egressService: EgressService) {}

  @Post()
  create(@Body() createEgressDto: CreateEgressDto) {
    return this.egressService.create(createEgressDto);
  }

  @Get()
  findAll() {
    return this.egressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() updateEgressDto: UpdateEgressDto,
  ) {
    return this.egressService.update(id, updateEgressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.remove(id);
  }
}
