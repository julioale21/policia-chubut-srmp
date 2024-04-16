import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEgressDto } from './dto/create-egress.dto';
import { UpdateEgressDto } from './dto/update-egress.dto';
import { Egress } from './entities/egress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MovilesService } from 'src/moviles/moviles.service';
import { MechanicsService } from 'src/mechanics/mechanics.service';

@Injectable()
export class EgressService {
  constructor(
    private readonly movileService: MovilesService,
    private readonly mechanicService: MechanicsService,
    @InjectRepository(Egress)
    private readonly egressRepository: Repository<Egress>,
  ) {}

  async create(createEgressDto: CreateEgressDto) {
    const { movile_id, mechanic_boss_id, mechanic_id, ...restData } =
      createEgressDto;

    const [movil, mechanic_boss, mechanic] = await Promise.all([
      await this.movileService.findOne(movile_id),
      await this.mechanicService.findOne(mechanic_boss_id),
      await this.mechanicService.findOne(mechanic_id),
    ]);

    const egress = this.egressRepository.create({
      ...restData,
      movil,
      mechanic_boss,
      mechanic,
    });

    try {
      return await this.egressRepository.save(egress);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.egressRepository.find();
  }

  async findOne(id: string) {
    const egress = await this.egressRepository.findOne({ where: { id } });

    if (!egress) {
      throw new UnprocessableEntityException('Egress not found');
    }

    return egress;
  }

  async update(id: string, updateEgressDto: UpdateEgressDto) {
    const egress = await this.egressRepository.findOne({ where: { id } });

    if (!egress) {
      throw new UnprocessableEntityException('Egress not found');
    }

    const { movile_id, mechanic_boss_id, mechanic_id, ...restData } =
      updateEgressDto;

    const movil = await this.movileService.findOne(movile_id);

    const mechanic_boss = await this.mechanicService.findOne(mechanic_boss_id);

    const mechanic = await this.mechanicService.findOne(mechanic_id);

    const updatedEgress = this.egressRepository.merge(egress, {
      ...restData,
      movil,
      mechanic_boss,
      mechanic,
    });

    try {
      return await this.egressRepository.save(updatedEgress);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    const egress = await this.egressRepository.findOne({ where: { id } });

    if (!egress) {
      throw new UnprocessableEntityException('Egress not found');
    }

    await this.egressRepository.remove(egress);

    return `Removed egress with id: #${id}`;
  }
}
