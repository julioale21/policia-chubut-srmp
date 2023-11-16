import { Module } from '@nestjs/common';
import { DependenciesService } from './dependencies.service';
import { DependenciesController } from './dependencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependency } from './entities/dependency.entity';

@Module({
  controllers: [DependenciesController],
  providers: [DependenciesService],
  imports: [TypeOrmModule.forFeature([Dependency])],
  exports: [DependenciesService],
})
export class DependenciesModule {}
