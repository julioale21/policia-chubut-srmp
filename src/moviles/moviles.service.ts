import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMovileDto } from './dto/create-movile.dto';
import { UpdateMovileDto } from './dto/update-movile.dto';
import { DependenciesService } from 'src/dependencies/dependencies.service';
import { Movil } from './entities/movil.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class MovilesService {
  constructor(
    private readonly dependenciesService: DependenciesService,
    @InjectRepository(Movil)
    private readonly movileRepository: Repository<Movil>,
  ) {}

  async create(createMovileDto: CreateMovileDto): Promise<Movil> {
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
      const movil = this.movileRepository.create({
        ...createMovileDto,
        dependency,
      });

      return await this.movileRepository.save(movil);
    } catch (error) {
      Logger.error(error.message);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAll(): Promise<Movil[]> {
    return this.movileRepository.find({ relations: { dependency: true } });
  }

  async findOne(id: string): Promise<Movil> {
    return await this.movileRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovileDto: UpdateMovileDto): Promise<Movil> {
    const movil = await this.movileRepository.findOne({ where: { id } });

    if (!movil) {
      throw new NotFoundException('Movil not found');
    }

    Object.assign(movil, updateMovileDto);
    return this.movileRepository.save(movil);
  }

  async remove(id: string) {
    const movil = await this.movileRepository.findOne({ where: { id } });

    if (!movil) {
      throw new NotFoundException('Movil not found');
    }

    await this.movileRepository.remove(movil);

    return `Movil ${movil.id} deleted`;
  }

  async deleteAllMoviles() {
    const query = this.movileRepository.createQueryBuilder('movile');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAndCount() {
    try {
      const [moviles, count] = await this.movileRepository.findAndCount();
      return { moviles, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
