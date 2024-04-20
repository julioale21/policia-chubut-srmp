import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { IngressService } from './ingress.service';
import { CreateIngressDto } from './dto/create-ingress.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { UpdateIngressDto } from './dto/update-ingress.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('ingress')
@Auth()
export class IngressController {
  constructor(private readonly ingressService: IngressService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createIngressDto: CreateIngressDto) {
    return this.ingressService.create(createIngressDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit, searchTerm } = paginationDto;

    return this.ingressService.findAllAndSearch(page, limit, searchTerm);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngressDto: UpdateIngressDto) {
    return this.ingressService.update(id, updateIngressDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.supeUser)
  remove(@Param('id') id: string) {
    return this.ingressService.remove(id);
  }
}
