import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  // ParseUUIDPipe,
} from '@nestjs/common';
import { SparePartOrderService } from './spare_part_order.service';
import { CreateSparePartOrderDto } from './dto/create-spare_part_order.dto';
// import { UpdateSparePartOrderDto } from './dto/update-spare_part_order.dto';

@Controller('spare-part-order')
export class SparePartOrderController {
  constructor(private readonly sparePartOrderService: SparePartOrderService) {}

  @Post()
  create(@Body() createSparePartOrderDto: CreateSparePartOrderDto) {
    return this.sparePartOrderService.create(createSparePartOrderDto);
  }

  @Get()
  findAll() {
    return this.sparePartOrderService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.sparePartOrderService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateSparePartOrderDto: UpdateSparePartOrderDto,
  // ) {
  //   return this.sparePartOrderService.update(id, updateSparePartOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.sparePartOrderService.remove(id);
  // }
}
