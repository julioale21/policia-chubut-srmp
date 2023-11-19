import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  ParseUUIDPipe,
  // Delete,
} from '@nestjs/common';
import { IngressService } from './ingress.service';
import { CreateIngressDto } from './dto/create-ingress.dto';
// import { UpdateIngressDto } from './dto/update-ingress.dto';

@Controller('ingress')
export class IngressController {
  constructor(private readonly ingressService: IngressService) {}

  @Post()
  create(@Body() createIngressDto: CreateIngressDto) {
    return this.ingressService.create(createIngressDto);
  }

  @Get()
  findAll() {
    return this.ingressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingressService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIngressDto: UpdateIngressDto) {
  //   return this.ingressService.update(+id, updateIngressDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ingressService.remove(+id);
  // }
}
