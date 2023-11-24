import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EgressService } from './egress.service';
import { EgressController } from './egress.controller';
import { Egress } from './entities/egress.entity';
import { MovilesModule } from 'src/moviles/moviles.module';
import { MechanicsModule } from 'src/mechanics/mechanics.module';

@Module({
  controllers: [EgressController],
  providers: [EgressService],
  imports: [MovilesModule, MechanicsModule, TypeOrmModule.forFeature([Egress])],
  exports: [EgressService],
})
export class EgressModule {}
