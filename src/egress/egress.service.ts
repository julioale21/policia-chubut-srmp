import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import { CreateEgressDto, SparePartDto } from './dto/create-egress.dto';
import { Egress } from './entities/egress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderType } from 'src/spare_part_order/dto/create-spare_part_order.dto';
import { SparePartService } from 'src/spare_part/spare_part.service';
import { SparePart } from 'src/spare_part/entities/spare_part.entity';
import { IngressService } from 'src/ingress/ingress.service';
import { IngressStatus } from 'src/ingress/dto/create-ingress.dto';
import { Ingress } from 'src/ingress/entities/ingress.entity';
import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';
import { OrderLine } from 'src/order_line/entities/order_line.entity';

@Injectable()
export class EgressService {
  private readonly logger = new Logger('EgressService');

  constructor(
    @InjectRepository(Egress)
    private readonly egressRepository: Repository<Egress>,
    private readonly sparePartService: SparePartService,
    private readonly ingressService: IngressService,
    private dataSource: DataSource,
  ) {}

  async create(createEgressDto: CreateEgressDto) {
    const {
      movil_id,
      mechanic_boss_id,
      mechanic_id,
      ingress_id,
      spare_parts,
      order_number,
      ...restData
    } = createEgressDto;

    // Validate ingress
    await this.validateIngress(ingress_id);

    // Validate stock
    await this.validateStock(spare_parts);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const spart_part_order = await this.createSparePartOrder(
        queryRunner.manager,
        {
          order_number: order_number,
          date: new Date(),
          observations: '',
          type: OrderType.out,
        },
      );

      // Create order lines
      await this.createOrderLines(
        queryRunner.manager,
        spart_part_order.id,
        spare_parts,
      );

      // Update stock
      await this.updateStock(queryRunner.manager, spare_parts);

      // Create egress
      const egress = queryRunner.manager.create(Egress, {
        ...restData,
        order_number,
        date: new Date(),
        movil: { id: movil_id },
        mechanic_boss: { id: mechanic_boss_id },
        mechanic: { id: mechanic_id },
        ingress: { id: ingress_id },
        spare_part_order: spart_part_order,
      });

      // Update ingress status
      await queryRunner.manager.update(Ingress, ingress_id, {
        status: IngressStatus.Completed,
      });

      await queryRunner.manager.save(egress);

      await queryRunner.commitTransaction();
      return egress;
    } catch (error) {
      this.logger.error(error.message);
      await queryRunner.rollbackTransaction();
      this.handleTransactionalDatabaseError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 0, limit: number = 10) {
    const offset = page * limit;

    const [data, total] = await this.egressRepository.findAndCount({
      relations: [
        'movil',
        'ingress',
        'mechanic',
        'mechanic_boss',
        'spare_part_order',
      ],
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
      egressOrders: data,
      total,
    };
  }

  async findAllAndSearch(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ egressOrders: Egress[]; total: number }> {
    try {
      const offset = page * limit;

      const query = this.egressRepository
        .createQueryBuilder('egress')
        .leftJoinAndSelect('egress.mechanic', 'mechanic')
        .leftJoinAndSelect('egress.mechanic_boss', 'mechanic_boss')
        .leftJoinAndSelect('egress.movil', 'movil')
        .leftJoinAndSelect('egress.ingress', 'ingress')
        .leftJoinAndSelect('egress.spare_part_order', 'spare_part_order')
        .where('egress.deletedAt IS NULL')
        .orderBy('egress.date', 'DESC')
        .skip(offset)
        .take(limit);

      if (searchTerm && searchTerm !== '' && searchTerm !== 'undefined') {
        query.andWhere(
          new Brackets((qb) => {
            qb.where("TO_CHAR(egress.date, 'DD/MM') LIKE :searchTerm", {
              searchTerm: `%${searchTerm}%`,
            })
              .orWhere('egress.observations::text LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere('egress.order_number LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
              });
          }),
        );
      }

      const [data, total] = await query.getManyAndCount();

      return {
        egressOrders: data,
        total,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findOne(id: string) {
    const egress = await this.egressRepository.findOne({
      where: { id },
      relations: [
        'movil',
        'ingress',
        'mechanic',
        'mechanic_boss',
        'spare_part_order',
      ],
    });

    if (!egress) {
      throw new UnprocessableEntityException('Egress not found');
    }

    return egress;
  }

  async remove(id: string): Promise<string> {
    const egress = await this.egressRepository.findOne({ where: { id } });

    if (!egress) throw new NotFoundException('Egress order not found');

    egress.deletedAt = new Date();
    await this.egressRepository.save(egress);

    return `Soft removed egress order with id: #${id}`;
  }

  async deleteAllEgresses() {
    const query = this.egressRepository.createQueryBuilder('egress');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createSparePartOrder(
    queryRunner: EntityManager,
    orderDetails: {
      order_number: string;
      date: Date;
      observations: string;
      type: string;
    },
  ): Promise<SparePartOrder> {
    const orderData = {
      order_number: orderDetails.order_number,
      date: orderDetails.date || new Date(),
      observations: orderDetails.observations || '',
      type: orderDetails.type || OrderType.out,
    };
    return this.createWithManager(queryRunner, orderData, SparePartOrder);
  }

  async createOrderLines(
    manager: EntityManager,
    spart_part_order_id: string,
    spare_parts: SparePartDto[],
  ): Promise<void> {
    await Promise.all(
      spare_parts.map(async (spare_part) =>
        this.createWithManager(
          manager,
          {
            quantity: spare_part.quantity,
            sparePartOrder: { id: spart_part_order_id },
            sparePart: { id: spare_part.id },
          },
          OrderLine,
        ),
      ),
    );
  }

  async updateStock(
    manager: EntityManager,
    spare_parts: SparePartDto[],
  ): Promise<void> {
    for (const spare_part of spare_parts) {
      await manager.decrement(
        SparePart,
        { id: spare_part.id },
        'stock',
        spare_part.quantity,
      );
    }
  }

  async createWithManager<T>(
    manager: EntityManager,
    createDto: any,
    entity: { new (): T },
  ): Promise<T> {
    const entityInstance = manager.create(entity, createDto);
    await manager.save(entityInstance);
    return entityInstance;
  }

  handleTransactionalDatabaseError(error: any): never {
    const logger = new Logger('DatabaseErrorHandler');
    if (error.driverError && error.driverError.code) {
      switch (error.driverError.code) {
        case '23505':
          throw new BadRequestException('Duplicate entry detected.');
        case '23503':
          throw new BadRequestException('Referenced entity not found.');
        default:
          logger.error(`Database error: ${error.message}`, error.stack);
          throw new InternalServerErrorException('Database error occurred.');
      }
    } else {
      logger.error('Failed to process your request', error.stack);
      throw new InternalServerErrorException('Failed to process your request.');
    }
  }

  async validateStock(spare_parts: SparePartDto[]) {
    const stockShortages = [];

    for (const part of spare_parts) {
      const sparePart = await this.sparePartService.findOne(part.id);
      if (!sparePart || sparePart.stock < part.quantity) {
        stockShortages.push({
          partId: part.id,
          partModel: sparePart.model,
          requested: part.quantity,
          inStock: sparePart ? sparePart.stock : 0,
          description: `Insufficient stock for part model ${sparePart.model}`,
        });
      }
    }

    if (stockShortages.length) {
      throw new UnprocessableEntityException({
        message: 'Stock shortages',
        error: 'Unprocessable Entity',
        statusCode: 422,
        stockShortages: stockShortages,
      });
    }
  }

  async validateIngress(ingress_id: string) {
    const ingress = await this.ingressService.findOne(ingress_id);

    if (!ingress) {
      throw new UnprocessableEntityException('Ingress not found');
    }

    if (ingress.deletedAt) {
      throw new UnprocessableEntityException('Ingress is deleted');
    }

    if (ingress.status === IngressStatus.Completed) {
      throw new UnprocessableEntityException('Ingress is already completed');
    }
  }

  async getAllAndCount() {
    const query = this.egressRepository
      .createQueryBuilder('egress')
      .where('egress.deletedAt IS NULL');

    try {
      const [data, count] = await query.getManyAndCount();
      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
