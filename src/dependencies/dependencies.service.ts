import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDependencyDto } from './dto/create-dependency.dto';
import { UpdateDependencyDto } from './dto/update-dependency.dto';
import { Dependency } from './entities/dependency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

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

  async findAll() {
    return await this.dependencyRepository.find();
  }

  async findOne(term: string) {
    let dependency: Dependency;

    if (isUUID(term)) {
      dependency = await this.dependencyRepository.findOne({
        where: { id: term },
      });
    } else {
      const queryBuilder =
        this.dependencyRepository.createQueryBuilder('dependency');
      dependency = await queryBuilder
        .where('UPPER(description) LIKE :description', {
          description: `%${term.toUpperCase()}%`,
        })
        .getOne();
    }

    if (!dependency) {
      throw new NotFoundException(`Dependency with ${term} not found`);
    }

    return dependency;
  }

  async update(id: string, updateDependencyDto: UpdateDependencyDto) {
    if (!isUUID(id)) {
      throw new UnprocessableEntityException('Invalid UUID');
    }

    const dependency = await this.dependencyRepository.findOne({
      where: { id },
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with id ${id} not found`);
    }

    const updatedDependency = Object.assign(dependency, updateDependencyDto);
    return await this.dependencyRepository.save(updatedDependency);
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new UnprocessableEntityException('Invalid UUID');
    }

    const dependency = await this.dependencyRepository.findOne({
      where: { id },
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with id ${id} not found`);
    }

    return await this.dependencyRepository.delete(dependency);
  }
}
