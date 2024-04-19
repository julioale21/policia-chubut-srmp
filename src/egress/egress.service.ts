import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateEgressDto } from './dto/create-egress.dto';
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

  // async create(createEgressDto: CreateEgressDto) {
  //   const {
  //     movil_id,
  //     mechanic_boss_id,
  //     mechanic_id,
  //     ingress_id,
  //     spare_parts,
  //     order_number,
  //     ...restData
  //   } = createEgressDto;

  //   try {
  //     const spart_part_order = await this.sparePartOrderService.create({
  //       order_number: order_number,
  //       date: new Date(),
  //       observations: '',
  //       type: OrderType.out,
  //     });

  //     await Promise.all(
  //       spare_parts.map((spare_part) =>
  //         this.orderLineService.create({
  //           spare_part_order_id: spart_part_order.id,
  //           spare_part_id: spare_part.id,
  //           quantity: spare_part.quantity,
  //         }),
  //       ),
  //     );

  //     const egress = this.egressRepository.create({
  //       ...restData,
  //       order_number,
  //       date: new Date(),
  //       movil: { id: movil_id },
  //       mechanic_boss: { id: mechanic_boss_id },
  //       mechanic: { id: mechanic_id },
  //       ingress: { id: ingress_id },
  //       spare_part_order: spart_part_order,
  //     });

  //     //TODO update products stock

  //     return await this.egressRepository.save(egress);
  //   } catch (error) {
  //     console.log(error.detail);
  //     if (error.detail.includes('Key')) {
  //       throw new BadRequestException(error.detail);
  //     }

  //     throw new InternalServerErrorException(error.details);
  //   }
  // }

  async validateStock(spare_parts) {
    const stockShortages = [];

    for (const part of spare_parts) {
      const sparePart = await this.sparePartService.findOne(part.id);
      if (!sparePart || sparePart.stock < part.quantity) {
        stockShortages.push({
          partId: part.id,
          partModel: sparePart.model,
          requested: part.quantity,
          inStock: sparePart ? sparePart.stock : 0,
          description: `Insufficient stock for part model ${part.sparePart}`,
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
      const spart_part_order = await queryRunner.manager.save(
        await this.sparePartOrderService.create({
          order_number: order_number,
          date: new Date(),
          observations: '',
          type: OrderType.out,
        }),
      );

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

      for (const spare_part of spare_parts) {
        // Actualizar el stock
        await queryRunner.manager.decrement(
          SparePart,
          { id: spare_part.id },
          'stock',
          spare_part.quantity,
        );
      }

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

  // async update(id: string, updateEgressDto: UpdateEgressDto) {
  //   const egress = await this.egressRepository.findOne({ where: { id } });

  //   if (!egress) {
  //     throw new UnprocessableEntityException('Egress not found');
  //   }

  //   const { movile_id, mechanic_boss_id, mechanic_id, ...restData } =
  //     updateEgressDto;

  //   const movil = await this.movileService.findOne(movile_id);

  //   const mechanic_boss = await this.mechanicService.findOne(mechanic_boss_id);

  //   const mechanic = await this.mechanicService.findOne(mechanic_id);

  //   const updatedEgress = this.egressRepository.merge(egress, {
  //     ...restData,
  //     movil,
  //     mechanic_boss,
  //     mechanic,
  //   });

  //   try {
  //     return await this.egressRepository.save(updatedEgress);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async remove(id: string) {
    const egress = await this.egressRepository.findOne({ where: { id } });

    if (!egress) {
      throw new UnprocessableEntityException('Egress not found');
    }

    await this.egressRepository.remove(egress);

    return `Removed egress with id: #${id}`;
  }
}
