import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { IngressModule } from 'src/ingress/ingress.module';
import { EgressModule } from 'src/egress/egress.module';
import { ProviderModule } from 'src/provider/provider.module';
import { MovilesModule } from 'src/moviles/moviles.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [IngressModule, EgressModule, ProviderModule, MovilesModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
