import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { IngressService } from './ingress.service';
import { IngressController } from './ingress.controller';
import { Ingress } from './entities/ingress.entity';
import { MovilesModule } from 'src/moviles/moviles.module';
import { EquipementsModule } from 'src/equipements/equipements.module';
import { EquipementIngressModule } from 'src/equipement-ingress/equipement-ingress.module';

@Module({
  controllers: [IngressController],
  providers: [IngressService],
  imports: [
    TypeOrmModule.forFeature([Ingress]),
    MovilesModule,
    EquipementsModule,
    forwardRef(() => EquipementIngressModule),
  ],
  exports: [IngressService],
})
export class IngressModule {}
