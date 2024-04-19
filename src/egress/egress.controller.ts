import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EgressService } from './egress.service';
import { CreateEgressDto } from './dto/create-egress.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';
import { Auth } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('egress')
@Auth()
export class EgressController {
  constructor(private readonly egressService: EgressService) {}

  @Post()
  create(@Body() createEgressDto: CreateEgressDto) {
    return this.egressService.create(createEgressDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit, searchTerm } = paginationDto;

    return this.egressService.findAllAndSearch(page, limit, searchTerm);
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.remove(id);
  }
}
