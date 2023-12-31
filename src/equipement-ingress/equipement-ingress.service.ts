import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipementIngressDto } from './dto/create-equipement-ingress.dto';
import { EquipementIngress } from './entities/equipement-ingress.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngressService } from 'src/ingress/ingress.service';
import { EquipementsService } from 'src/equipements/equipements.service';

@Injectable()
export class EquipementIngressService {
  constructor(
    @InjectRepository(EquipementIngress)
    private readonly equipementIngressRepository: Repository<EquipementIngress>,

    private readonly ingressService: IngressService,
    private readonly equipementsService: EquipementsService,
  ) {}

  async create(createEquipementIngressDto: CreateEquipementIngressDto) {
    const { ingressId, equipementId } = createEquipementIngressDto;

    const ingress = await this.ingressService.findOne(ingressId);

    if (!ingress) throw new NotFoundException('Ingress not found');

    const equipement = await this.equipementsService.findOne(equipementId);

    if (!equipement) throw new NotFoundException('Equipement not found');

    try {
      const equipementIngress = this.equipementIngressRepository.create({
        ...createEquipementIngressDto,
        ingress,
        equipement,
      });

      return await this.equipementIngressRepository.save(equipementIngress);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.equipementIngressRepository.find({
      relations: ['ingress', 'equipement'],
      select: {
        ingress: {
          id: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const equipementIngress = await this.equipementIngressRepository.findOne({
      where: { id },
    });

    if (!equipementIngress)
      throw new NotFoundException('Equipement Ingress not found');

    return equipementIngress;
  }

  async remove(id: string) {
    return this.equipementIngressRepository.delete(id);
  }
}
