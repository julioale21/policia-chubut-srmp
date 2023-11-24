import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DependenciesService } from './dependencies.service';
import { CreateDependencyDto } from './dto/create-dependency.dto';
import { UpdateDependencyDto } from './dto/update-dependency.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('dependencies')
export class DependenciesController {
  constructor(private readonly dependenciesService: DependenciesService) {}

  @Post()
  create(@Body() createDependencyDto: CreateDependencyDto) {
    return this.dependenciesService.create(createDependencyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.dependenciesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') id: string) {
    return this.dependenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() updateDependencyDto: UpdateDependencyDto,
  ) {
    return this.dependenciesService.update(id, updateDependencyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.dependenciesService.remove(id);
  }
}
