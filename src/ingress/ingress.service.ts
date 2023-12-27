import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateIngressDto } from './dto/create-ingress.dto';
import { UpdateIngressDto } from './dto/update-ingress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingress } from './entities/ingress.entity';
import { DataSource, Repository } from 'typeorm';
import { MovilesService } from 'src/moviles/moviles.service';
import { Movile } from 'src/moviles/entities/movile.entity';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';

@Injectable()
export class IngressService {
  constructor(
    @InjectRepository(Ingress)
    private readonly ingressRepository: Repository<Ingress>,

    private readonly movilesService: MovilesService,
    private datasource: DataSource,
  ) {}

  async create(createIngressDto: CreateIngressDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        const { movile_id, equipements } = createIngressDto;

        const movile: Movile = await entityManager.findOne(Movile, {
          where: { id: movile_id },
        });
        if (!movile) throw new BadRequestException('Movil not found');

        const ingress = this.ingressRepository.create({
          ...createIngressDto,
          date: createIngressDto.date
            ? new Date(createIngressDto.date)
            : new Date(),
          movile: movile,
        });

        const savedIngress = await entityManager.save(ingress);

        for (const equipId of equipements) {
          const equipement = await entityManager.findOne(Equipement, {
            where: { id: equipId },
          });
          if (!equipement)
            throw new BadRequestException('Equipement not found');

          const equipementIngress = entityManager.create(EquipementIngress, {
            equipement,
            ingress: savedIngress,
          });
          await entityManager.save(equipementIngress);
        }

        return savedIngress;
      });
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new UnprocessableEntityException('Duplicated equipement');
      }
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Ingress[]> {
    try {
      const offset = (page - 1) * limit;
      return this.ingressRepository.find({
        relations: ['movile'],
        order: {
          date: 'DESC',
        },
        skip: offset,
        take: limit,
      });
    } catch (error) {
      console.log(error.message);
      throw new UnprocessableEntityException(error.message);
    }
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

    this.ingressRepository.merge(ingress, updateIngressDto);

    return await this.ingressRepository.save(ingress);
  }

  async remove(id: string): Promise<string> {
    const ingress = await this.ingressRepository.findOne({ where: { id } });

    if (!ingress) throw new NotFoundException('Ingress not found');

    await this.ingressRepository.remove(ingress);
    return `Removed ingress with id:  #${id}`;
  }

  async deleteAllIngresses() {
    const query = this.ingressRepository.createQueryBuilder('ingress');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
