import { CreateSparePartDto } from './../spare_part/dto/create-spare_part.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateEgressDto, SparePartDto } from './dto/create-egress.dto';
// import { UpdateEgressDto } from './dto/update-egress.dto';
import { Egress } from './entities/egress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SparePartOrderService } from 'src/spare_part_order/spare_part_order.service';
import { OrderType } from 'src/spare_part_order/dto/create-spare_part_order.dto';
import { OrderLineService } from 'src/order_line/order_line.service';
import { SparePartService } from 'src/spare_part/spare_part.service';
import { SparePart } from 'src/spare_part/entities/spare_part.entity';

@Injectable()
export class EgressService {
  constructor(
    @InjectRepository(Egress)
    private readonly egressRepository: Repository<Egress>,
    private readonly sparePartOrderService: SparePartOrderService,
    private readonly orderLineService: OrderLineService,
    private readonly sparePartService: SparePartService,
    private dataSource: DataSource,
  ) {}

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

    return stockShortages;
  }

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Validate stock
    const stockShortages = await this.validateStock(spare_parts);
    if (stockShortages.length) {
      throw new UnprocessableEntityException({
        message: 'Stock shortages',
        error: 'Unprocessable Entity',
        statusCode: 422,
        stockShortages: stockShortages,
      });
    }

    try {
      // Create spare part order
      const spart_part_order = await queryRunner.manager.save(
        await this.sparePartOrderService.create({
          order_number: order_number,
          date: new Date(),
          observations: '',
          type: OrderType.out,
        }),
      );

      // Create order lines
      await Promise.all(
        spare_parts.map(async (spare_part) =>
          queryRunner.manager.save(
            await this.orderLineService.create({
              spare_part_order_id: spart_part_order.id,
              spare_part_id: spare_part.id,
              quantity: spare_part.quantity,
            }),
          ),
        ),
      );

      // Update stock
      for (const spare_part of spare_parts) {
        await queryRunner.manager.decrement(
          SparePart,
          { id: spare_part.id },
          'stock',
          spare_part.quantity,
        );
      }

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

      await queryRunner.manager.save(egress);

      await queryRunner.commitTransaction();
      return egress;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating egress');
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
      data,
      total,
    };
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
}
