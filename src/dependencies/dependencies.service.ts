import { Injectable } from '@nestjs/common';
import { CreateDependencyDto } from './dto/create-dependency.dto';
// import { UpdateDependencyDto } from './dto/update-dependency.dto';
import { Dependency } from './entities/dependency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DependenciesService {
  constructor(
    @InjectRepository(Dependency)
    private readonly dependencyRepository: Repository<Dependency>,
  ) {}

  async create(createDependencyDto: CreateDependencyDto) {
    try {
      const dependency = this.dependencyRepository.create(createDependencyDto);
      await this.dependencyRepository.save(dependency);
      return dependency;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all dependencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dependency`;
  }

  // update(id: number, updateDependencyDto: UpdateDependencyDto) {
  //   return `This action updates a #${id} dependency`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dependency`;
  }
}
