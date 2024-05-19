import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EgressService } from './egress.service';
import { EgressController } from './egress.controller';
import { Egress } from './entities/egress.entity';
import { IngressModule } from 'src/ingress/ingress.module';
import { SparePartModule } from 'src/spare_part/spare_part.module';

@Module({
  controllers: [EgressController],
  providers: [EgressService],
  imports: [TypeOrmModule.forFeature([Egress]), IngressModule, SparePartModule],
  exports: [EgressService],
})
export class EgressModule {}
