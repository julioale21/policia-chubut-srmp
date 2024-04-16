import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateIngressDto } from './dto/create-ingress.dto';
import { UpdateIngressDto } from './dto/update-ingress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingress } from './entities/ingress.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { MovilesService } from 'src/moviles/moviles.service';
import { Movil } from 'src/moviles/entities/movil.entity';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';

@Injectable()
export class IngressService {
  private readonly logger = new Logger('IngressService');

  constructor(
    @InjectRepository(Ingress)
    private readonly ingressRepository: Repository<Ingress>,

    private readonly movilesService: MovilesService,
    private datasource: DataSource,
  ) {}

  async create(createIngressDto: CreateIngressDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        const { movil_id, equipements } = createIngressDto;

        const movil: Movil = await entityManager.findOne(Movil, {
          where: { id: movil_id },
        });
        if (!movil) throw new BadRequestException('Movil not found');

        const ingress = this.ingressRepository.create({
          ...createIngressDto,
          date: createIngressDto.date
            ? new Date(createIngressDto.date)
            : new Date(),
          movil: movil,
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

  async findAll(
    page: number = 0,
    limit: number = 10,
  ): Promise<{ ingresses: Ingress[]; total: number }> {
    try {
      const offset = page * limit;
      const [data, total] = await this.ingressRepository.findAndCount({
        relations: ['movile'],
        where: {
          deletedAt: null,
        },
        order: {
          date: 'DESC',
        },
        skip: offset,
        take: limit,
      });

      return {
        ingresses: data,
        total,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAllAndSearch(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ ingresses: Ingress[]; total: number }> {
    try {
      const offset = page * limit;

      const query = this.ingressRepository
        .createQueryBuilder('ingress')
        .leftJoinAndSelect('ingress.movile', 'movile')
        .where('ingress.deletedAt IS NULL')
        .orderBy('ingress.date', 'DESC')
        .skip(offset)
        .take(limit);

      if (searchTerm && searchTerm !== '' && searchTerm !== 'undefined') {
        query.andWhere(
          new Brackets((qb) => {
            qb.where("TO_CHAR(ingress.date, 'DD/MM') LIKE :searchTerm", {
              searchTerm: `%${searchTerm}%`,
            })
              .orWhere('ingress.kilometers::text LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('ingress.repair_description LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('ingress.order_number LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('movile.brand LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('movile.domain LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('movile.internal_register LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              });
          }),
        );
      }

      const [data, total] = await query.getManyAndCount();

      return {
        ingresses: data,
        total,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findOne(id: string): Promise<Ingress> {
    const ingress = await this.ingressRepository.findOne({
      where: { id },
      relations: [
        'movile',
        'equipementIngress',
        'equipementIngress.equipement',
      ],
    });

    if (!ingress) throw new NotFoundException('Ingress not found');

    return ingress;
  }

  async update(id: string, updateIngressDto: UpdateIngressDto) {
    const ingress = await this.ingressRepository.findOne({
      where: { id },
      relations: ['equipementIngress', 'equipementIngress.equipement'],
    });

    if (!ingress) throw new NotFoundException('Ingress not found');

    await this.datasource.transaction(async (entityManager) => {
      if (updateIngressDto.movil_id) {
        const movil = await this.movilesService.findOne(
          updateIngressDto.movil_id,
        );
        if (!movil) throw new BadRequestException('Movil not found');
        ingress.movil = movil;
      }

      const existingEquipementIds = ingress.equipementIngress.map(
        (ei) => ei.equipement.id,
      );

      const newEquipementIds = updateIngressDto.equipements || [];
      const equipementIdsToAdd = newEquipementIds.filter(
        (id) => !existingEquipementIds.includes(id),
      );
      const equipementIdsToRemove = existingEquipementIds.filter(
        (id) => !newEquipementIds.includes(id),
      );

      this.ingressRepository.merge(ingress, updateIngressDto);
      const savedIngress = await entityManager.save(ingress);

      for (const equipementId of equipementIdsToRemove) {
        const equipementIngressToRemove = await entityManager.findOne(
          EquipementIngress,
          {
            where: {
              equipement: { id: equipementId },
              ingress: { id: ingress.id },
            },
          },
        );

        if (equipementIngressToRemove) {
          await entityManager.delete(EquipementIngress, {
            equipement: { id: equipementId },
            ingress: ingress,
          });
        }
      }

      for (const equipId of equipementIdsToAdd) {
        const equipement = await entityManager.findOne(Equipement, {
          where: { id: equipId },
        });
        if (!equipement) throw new BadRequestException('Equipement not found');

        const equipementIngress = entityManager.create(EquipementIngress, {
          equipement: equipement,
          ingress: savedIngress,
        });
        await entityManager.save(equipementIngress);
      }
    });

    return await this.ingressRepository.findOne({
      where: { id },
      relations: [
        'equipementIngress',
        'equipementIngress.equipement',
        'movile',
      ],
    });
  }

  async remove(id: string): Promise<string> {
    const ingress = await this.ingressRepository.findOne({ where: { id } });

    if (!ingress) throw new NotFoundException('Ingress not found');

    ingress.deletedAt = new Date();
    await this.ingressRepository.save(ingress);

    return `Soft removed ingress with id: #${id}`;
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
