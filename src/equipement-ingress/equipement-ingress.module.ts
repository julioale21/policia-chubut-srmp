import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipementIngressService } from './equipement-ingress.service';
import { EquipementIngressController } from './equipement-ingress.controller';
import { EquipementIngress } from './entities/equipement-ingress.entity';
import { IngressModule } from 'src/ingress/ingress.module';
import { EquipementsModule } from 'src/equipements/equipements.module';

@Module({
  controllers: [EquipementIngressController],
  providers: [EquipementIngressService],
  imports: [
    TypeOrmModule.forFeature([EquipementIngress]),
    EquipementsModule,
    forwardRef(() => IngressModule),
  ],
  exports: [EquipementIngressService],
})
export class EquipementIngressModule {}
