import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderLineService } from './order_line.service';
import { CreateOrderLineDto } from './dto/create-order_line.dto';
// import { UpdateOrderLineDto } from './dto/update-order_line.dto';

@Controller('order-line')
export class OrderLineController {
  constructor(private readonly orderLineService: OrderLineService) {}

  @Post()
  create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return this.orderLineService.create(createOrderLineDto);
  }

  @Get()
  findAll() {
    return this.orderLineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderLineService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateOrderLineDto: UpdateOrderLineDto,
  // ) {
  //   return this.orderLineService.update(id, updateOrderLineDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.orderLineService.remove(id);
  // }
}
