import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DependenciesModule } from 'src/dependencies/dependencies.module';
import { MovilesModule } from 'src/moviles/moviles.module';
import { EquipementsModule } from 'src/equipements/equipements.module';
import { IngressModule } from 'src/ingress/ingress.module';
import { EquipementIngressModule } from 'src/equipement-ingress/equipement-ingress.module';
import { MechanicsModule } from 'src/mechanics/mechanics.module';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    DependenciesModule,
    MovilesModule,
    EquipementsModule,
    IngressModule,
    EquipementIngressModule,
    MechanicsModule,
    ProviderModule,
  ],
})
export class SeedModule {}
