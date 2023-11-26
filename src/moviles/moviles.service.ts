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

    if (!dependencyId && !dependencyDescription) {
      throw new UnprocessableEntityException(
        'Dependency id or description is required',
      );
    }

    if (dependencyId) {
      if (!isUUID(dependencyId)) {
        throw new UnprocessableEntityException('Dependency id is not valid');
      }

      dependency = await this.dependenciesService.findOne(dependencyId);

      if (!dependency) {
        throw new NotFoundException('Dependency not found');
      }
    } else if (dependencyDescription) {
      dependency = await this.dependenciesService.create({
        name: dependencyDescription,
      });
    }

    try {
      const movile = this.movileRepository.create({
        ...createMovileDto,
        dependency,
      });

      return await this.movileRepository.save(movile);
    } catch (error) {
      Logger.error(error.message);
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

    await this.movileRepository.remove(movile);

    return `Movile ${movile.id} deleted`;
  }
}
