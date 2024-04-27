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
import { Between, Brackets, DataSource, Repository } from 'typeorm';
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
        relations: ['movil'],
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
        .leftJoinAndSelect('ingress.movil', 'movil')
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
              .orWhere('movil.brand LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('movil.domain LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('movil.internal_register LIKE :searchTerm', {
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
      relations: ['movil', 'equipementIngress', 'equipementIngress.equipement'],
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
      relations: ['equipementIngress', 'equipementIngress.equipement', 'movil'],
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

  async getAllAndCount(): Promise<{ ingresses: Ingress[]; count: number }> {
    try {
      const query = this.ingressRepository
        .createQueryBuilder('ingress')
        .where('ingress.deletedAt IS NULL');
      const [ingresses, count] = await query.getManyAndCount();
      return { ingresses, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOrdersCountByMonth(): Promise<{ [key: string]: number }> {
    const currentDate = new Date(); // Current date in server's local time
    const utcCurrentDate = new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1),
    );

    const fourMonthsAgo = new Date(utcCurrentDate);
    fourMonthsAgo.setMonth(utcCurrentDate.getMonth() - 3);

    try {
      const query = this.ingressRepository
        .createQueryBuilder('ingress')
        .select(
          "TO_CHAR(DATE_TRUNC('month', ingress.date AT TIME ZONE 'UTC'), 'YYYY-MM')",
          'yearMonth',
        )
        .addSelect('COUNT(*)', 'count')
        .where('ingress.date >= :date', { date: fourMonthsAgo.toISOString() })
        .andWhere('ingress.deletedAt IS NULL')
        .groupBy("DATE_TRUNC('month', ingress.date AT TIME ZONE 'UTC')")
        .orderBy("DATE_TRUNC('month', ingress.date AT TIME ZONE 'UTC')");

      const results = await query.getRawMany();

      // Initialize monthCounts with all months set to 0
      const monthCounts = {};
      for (let i = 0; i < 4; i++) {
        const tempDate = new Date(
          Date.UTC(
            utcCurrentDate.getUTCFullYear(),
            utcCurrentDate.getUTCMonth() - i,
            1,
          ),
        );
        const monthName = tempDate.toLocaleString('en-US', {
          month: 'long',
          timeZone: 'UTC',
        });
        monthCounts[monthName] = 0;
      }

      // Fill in actual counts from the results
      results.forEach((result) => {
        const yearMonth = result.yearMonth.split('-');
        const date = new Date(
          Date.UTC(
            parseInt(yearMonth[0], 10),
            parseInt(yearMonth[1], 10) - 1,
            1,
          ),
        ); // Convert to Date object in UTC
        const monthName = date.toLocaleString('en-US', {
          month: 'long',
          timeZone: 'UTC',
        });
        monthCounts[monthName] = parseInt(result.count, 10);
      });

      return monthCounts;
    } catch (error) {
      this.logger.error('Failed to fetch order count by month:', error);
      throw new InternalServerErrorException(
        'Failed to fetch order count by month',
      );
    }
  }

  async findAllThisMonthUpToToday(): Promise<{
    ingresses: Ingress[];
    total: number;
  }> {
    const currentDate = new Date();
    const firstDayThisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    try {
      const [data, total] = await this.ingressRepository.findAndCount({
        where: {
          date: Between(firstDayThisMonth, today),
          deletedAt: null,
        },
        order: {
          date: 'DESC',
        },
      });

      return {
        ingresses: data,
        total,
      };
    } catch (error) {
      this.logger.error(
        'Error fetching data for this month up to today:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to fetch data for this month up to today',
      );
    }
  }
}
