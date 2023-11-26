import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SparePartService } from './spare_part.service';
import { SparePartController } from './spare_part.controller';
import { SparePart } from './entities/spare_part.entity';

@Module({
  controllers: [SparePartController],
  providers: [SparePartService],
  imports: [TypeOrmModule.forFeature([SparePart])],
  exports: [SparePartService],
})
export class SparePartModule {}
