import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { EgressService } from './egress.service';
import { EgressController } from './egress.controller';
import { Egress } from './entities/egress.entity';
import { MovilesModule } from 'src/moviles/moviles.module';
import { MechanicsModule } from 'src/mechanics/mechanics.module';
import { IngressModule } from 'src/ingress/ingress.module';
import { SparePartOrderModule } from 'src/spare_part_order/spare_part_order.module';
import { OrderLineModule } from 'src/order_line/order_line.module';
import { SparePartModule } from 'src/spare_part/spare_part.module';

@Module({
  controllers: [EgressController],
  providers: [EgressService],
  imports: [
    MovilesModule,
    MechanicsModule,
    TypeOrmModule.forFeature([Egress]),
    IngressModule,
    forwardRef(() => SparePartOrderModule),
    OrderLineModule,
    SparePartModule,
  ],
  exports: [EgressService],
})
export class EgressModule {}
