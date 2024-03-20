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

  // @Get()
  // findAll(
  //   @Query('page') page: number = 0,
  //   @Query('limit') limit: number = 10,
  //   @Query('searchTerm') searchTerm?: string,
  // ) {
  //   console.log('page', page);
  //   return this.ingressService.findAllAndSearch(page, limit, searchTerm);
  // }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('searchTerm') searchTerm?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const validPage = !isNaN(pageNumber) ? pageNumber : 0;
    const validLimit = !isNaN(limitNumber) ? limitNumber : 10;

    return this.ingressService.findAllAndSearch(
      validPage,
      validLimit,
      searchTerm,
    );
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
