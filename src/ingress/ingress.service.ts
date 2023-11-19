import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIngressDto } from './dto/create-ingress.dto';
// import { UpdateIngressDto } from './dto/update-ingress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingress } from './entities/ingress.entity';
import { Repository } from 'typeorm';
import { MovilesService } from 'src/moviles/moviles.service';
import { EquipementsService } from 'src/equipements/equipements.service';
import { Movile } from 'src/moviles/entities/movile.entity';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { UpdateIngressDto } from './dto/update-ingress.dto';

@Injectable()
export class IngressService {
  constructor(
    @InjectRepository(Ingress)
    private readonly ingressRepository: Repository<Ingress>,

    private readonly movilesService: MovilesService,
    private readonly equipementsService: EquipementsService,
  ) {}

  async create(createIngressDto: CreateIngressDto) {
    const { movile_id, equipement_id } = createIngressDto;

    const movile: Movile = await this.movilesService.findOne(movile_id);
    if (!movile) throw new BadRequestException('Movil not found');

    const equipement: Equipement =
      await this.equipementsService.findOne(equipement_id);

    if (!equipement) throw new BadRequestException('Equipement not found');

    const ingress = this.ingressRepository.create({
      ...createIngressDto,
      date: createIngressDto.date
        ? new Date(createIngressDto.date)
        : new Date(),
      movile: movile,
      equipement: equipement,
    });

    return await this.ingressRepository.save(ingress);
  }

  async findAll(): Promise<Ingress[]> {
    return this.ingressRepository.find({
      relations: ['movile', 'equipement'],
    });
  }

  async findOne(id: string): Promise<Ingress> {
    const ingress = await this.ingressRepository.findOne({ where: { id } });

    if (!ingress) throw new NotFoundException('Ingress not found');

    return ingress;
  }

  async update(id: string, updateIngressDto: UpdateIngressDto) {
    const ingress = await this.ingressRepository.findOne({ where: { id } });
    if (!ingress) throw new NotFoundException('Ingress not found');

    if (updateIngressDto.movile_id) {
      const movile = await this.movilesService.findOne(
        updateIngressDto.movile_id,
      );
      if (!movile) throw new BadRequestException('Movil not found');
      ingress.movile = movile;
    }

    if (updateIngressDto.equipement_id) {
      const equipement = await this.equipementsService.findOne(
        updateIngressDto.equipement_id,
      );
      if (!equipement) throw new BadRequestException('Equipement not found');
      ingress.equipement = equipement;
    }

    this.ingressRepository.merge(ingress, updateIngressDto);

    return await this.ingressRepository.save(ingress);
  }

  async remove(id: string): Promise<string> {
    const ingress = await this.ingressRepository.findOne({ where: { id } });

    if (!ingress) throw new NotFoundException('Ingress not found');

    await this.ingressRepository.remove(ingress);
    return `This action removes a #${id} ingress`;
  }
}
