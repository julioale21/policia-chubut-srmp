import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDependencyDto } from './dto/create-dependency.dto';
import { UpdateDependencyDto } from './dto/update-dependency.dto';
import { Dependency } from './entities/dependency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DependenciesService {
  private readonly logger = new Logger('DependenciesService');
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
      this.logger.error(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.dependencyRepository.find({
      take: limit,
      skip: offset,
    });
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
        .where('UPPER(name) LIKE :description', {
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
    const dependency = await this.dependencyRepository.findOne({
      where: { id },
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with id ${id} not found`);
    }

    return await this.dependencyRepository.delete(dependency);
  }

  async deleteAllDependencies() {
    const query = this.dependencyRepository.createQueryBuilder('dependency');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
