import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { IngressService } from './ingress.service';
import { CreateIngressDto } from './dto/create-ingress.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

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
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.ingressService.findAllAndSearch(page, limit, searchTerm);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingressService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIngressDto: UpdateIngressDto) {
  //   return this.ingressService.update(id, updateIngressDto);
  // }

  @Delete(':id')
  @Auth(ValidRoles.supeUser)
  remove(@Param('id') id: string) {
    return this.ingressService.remove(id);
  }
}
