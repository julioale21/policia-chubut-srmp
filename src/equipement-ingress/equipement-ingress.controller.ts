import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  // ParseUUIDPipe,
} from '@nestjs/common';
import { EquipementIngressService } from './equipement-ingress.service';
// import { CreateEquipementIngressDto } from './dto/create-equipement-ingress.dto';
// import { UpdateEquipementIngressDto } from './dto/update-equipement-ingress.dto';

@Controller('equipement-ingress')
export class EquipementIngressController {
  constructor(
    private readonly equipementIngressService: EquipementIngressService,
  ) {}

  // @Post()
  // async create(@Body() createEquipementIngressDto: CreateEquipementIngressDto) {
  //   return await this.equipementIngressService.create(
  //     createEquipementIngressDto,
  //   );
  // }

  // @Get()
  // async findAll() {
  //   return await this.equipementIngressService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.equipementIngressService.findOne(id);
  // }

  // @Delete(':id')
  // async remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.equipementIngressService.remove(id);
  // }
}
