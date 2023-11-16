import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMovileDto } from './dto/create-movile.dto';
import { UpdateMovileDto } from './dto/update-movile.dto';
import { DependenciesService } from 'src/dependencies/dependencies.service';
import { Movile } from './entities/movile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class MovilesService {
  constructor(
    private readonly dependenciesService: DependenciesService,
    @InjectRepository(Movile)
    private readonly movileRepository: Repository<Movile>,
  ) {}

  async create(createMovileDto: CreateMovileDto): Promise<Movile> {
    let dependency: Dependency;
    const { dependencyId, dependencyDescription } = createMovileDto;

    if (dependencyId) {
      if (!isUUID(dependencyId)) {
        throw new UnprocessableEntityException('Dependency id is not valid');
      }

      dependency = await this.dependenciesService.findOne(dependencyId);

      if (!dependency) {
        throw new NotFoundException('Dependency not found');
      }
    }

    try {
      if (dependencyDescription) {
        dependency = await this.dependenciesService.findOne(
          dependencyDescription,
        );

        if (!dependency) {
          dependency = await this.dependenciesService.create({
            name: dependencyDescription,
          });
        }
      } else {
        dependency = await this.dependenciesService.create({
          name: dependencyDescription,
        });
      }

      const movile = this.movileRepository.create({
        ...createMovileDto,
        dependency,
      });

      await this.movileRepository.save(movile);
      return movile;
    } catch (error) {
      Logger.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAll(): Promise<Movile[]> {
    return this.movileRepository.find({ relations: { dependency: true } });
  }

  async findOne(id: string): Promise<Movile> {
    return await this.movileRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovileDto: UpdateMovileDto): Promise<Movile> {
    const movile = await this.movileRepository.findOne({ where: { id } });

    if (!movile) {
      throw new NotFoundException('Movile not found');
    }

    Object.assign(movile, updateMovileDto);
    return this.movileRepository.save(movile);
  }

  async remove(id: string) {
    const movile = await this.movileRepository.findOne({ where: { id } });

    if (!movile) {
      throw new NotFoundException('Movile not found');
    }

    return await this.movileRepository.remove(movile);
  }
}
