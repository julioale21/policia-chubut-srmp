import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipementsService } from './equipements.service';
import { EquipementsController } from './equipements.controller';
import { Equipement } from './entities/equipement.entity';
import { MovilesModule } from 'src/moviles/moviles.module';

@Module({
  controllers: [EquipementsController],
  providers: [EquipementsService],
  imports: [TypeOrmModule.forFeature([Equipement]), MovilesModule],
  exports: [EquipementsService],
})
export class EquipementsModule {}
