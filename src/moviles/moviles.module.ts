import { Module } from '@nestjs/common';
import { MovilesService } from './moviles.service';
import { MovilesController } from './moviles.controller';
import { DependenciesModule } from 'src/dependencies/dependencies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movile } from './entities/movile.entity';

@Module({
  controllers: [MovilesController],
  providers: [MovilesService],
  exports: [MovilesService],
  imports: [TypeOrmModule.forFeature([Movile]), DependenciesModule],
})
export class MovilesModule {}
