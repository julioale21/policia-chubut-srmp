import { Module } from '@nestjs/common';
import { MovilesService } from './moviles.service';
import { MovilesController } from './moviles.controller';
import { DependenciesModule } from 'src/dependencies/dependencies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movil } from './entities/movil.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MovilesController],
  providers: [MovilesService],
  exports: [MovilesService],
  imports: [TypeOrmModule.forFeature([Movil]), DependenciesModule, AuthModule],
})
export class MovilesModule {}
