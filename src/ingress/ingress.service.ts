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

  // update(id: number, updateIngressDto: UpdateIngressDto) {
  //   return `This action updates a #${id} ingress`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} ingress`;
  // }
}
