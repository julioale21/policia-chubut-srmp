import { Module } from '@nestjs/common';
import { OrderLineService } from './order_line.service';
import { OrderLineController } from './order_line.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLine } from './entities/order_line.entity';
import { SparePartModule } from 'src/spare_part/spare_part.module';
import { SparePartOrderModule } from 'src/spare_part_order/spare_part_order.module';

@Module({
  controllers: [OrderLineController],
  providers: [OrderLineService],
  imports: [
    TypeOrmModule.forFeature([OrderLine]),
    SparePartModule,
    SparePartOrderModule,
  ],
  exports: [OrderLineService],
})
export class OrderLineModule {}
