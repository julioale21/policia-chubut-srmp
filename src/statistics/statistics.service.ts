import { Injectable } from '@nestjs/common';
import { EgressService } from 'src/egress/egress.service';
import { IngressService } from 'src/ingress/ingress.service';
import { MovilesService } from 'src/moviles/moviles.service';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly ingressService: IngressService,
    private readonly egressService: EgressService,
    private readonly providerService: ProviderService,
    private readonly movilService: MovilesService,
  ) {}
  async getStatistics() {
    const { count: totalIngresses } =
      await this.ingressService.getAllAndCount();
    const resp = await this.ingressService.getOrdersCountByMonth();
    const lastOrders = await this.ingressService.findAllThisMonthUpToToday();

    const { count: totalEgresses } = await this.egressService.getAllAndCount();

    const { count: totalProviders } =
      await this.providerService.getAllAndCount();

    const { count: totalMoviles } = await this.movilService.getAllAndCount();

    return {
      ingresses: {
        total: totalIngresses,
        lastFourMonthsCount: resp,
        lastMothOrders: {
          ...lastOrders,
        },
      },
      egresses: {
        total: totalEgresses,
      },
      providers: {
        total: totalProviders,
      },
      moviles: {
        total: totalMoviles,
      },
    };
  }
}
