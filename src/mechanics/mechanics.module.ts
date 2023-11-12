import { Module } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicsController } from './mechanics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from './entities/mechanic.entity';

@Module({
  controllers: [MechanicsController],
  providers: [MechanicsService],
  imports: [TypeOrmModule.forFeature([Mechanic])],
})
export class MechanicsModule {}
