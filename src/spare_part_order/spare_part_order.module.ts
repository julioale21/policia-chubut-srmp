import { Module, forwardRef } from '@nestjs/common';
import { SparePartOrderService } from './spare_part_order.service';
import { SparePartOrderController } from './spare_part_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartOrder } from './entities/spare_part_order.entity';
import { ProviderModule } from 'src/provider/provider.module';
import { OrderLineModule } from 'src/order_line/order_line.module';
import { EgressModule } from 'src/egress/egress.module';

@Module({
  controllers: [SparePartOrderController],
  providers: [SparePartOrderService],
  imports: [
    TypeOrmModule.forFeature([SparePartOrder]),
    ProviderModule,
    OrderLineModule,
    forwardRef(() => EgressModule),
  ],
  exports: [SparePartOrderService],
})
export class SparePartOrderModule {}
