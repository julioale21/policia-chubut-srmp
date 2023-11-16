import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { IngressService } from './ingress.service';
import { IngressController } from './ingress.controller';
import { Ingress } from './entities/ingress.entity';
import { MovilesModule } from 'src/moviles/moviles.module';
import { EquipementsModule } from 'src/equipements/equipements.module';

@Module({
  controllers: [IngressController],
  providers: [IngressService],
  imports: [
    TypeOrmModule.forFeature([Ingress]),
    MovilesModule,
    EquipementsModule,
  ],
  exports: [IngressService],
})
export class IngressModule {}
