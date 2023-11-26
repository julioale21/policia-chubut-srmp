import { Module } from '@nestjs/common';
import { SparePartOrderService } from './spare_part_order.service';
import { SparePartOrderController } from './spare_part_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartOrder } from './entities/spare_part_order.entity';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  controllers: [SparePartOrderController],
  providers: [SparePartOrderService],
  imports: [TypeOrmModule.forFeature([SparePartOrder]), ProviderModule],
  exports: [SparePartOrderService],
})
export class SparePartOrderModule {}
