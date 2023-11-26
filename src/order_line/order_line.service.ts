import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order_line.dto';
import { UpdateOrderLineDto } from './dto/update-order_line.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderLine } from './entities/order_line.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { SparePart } from 'src/spare_part/entities/spare_part.entity';
import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';

@Injectable()
export class OrderLineService {
  constructor(
    @InjectRepository(OrderLine)
    private orderLineRepository: Repository<OrderLine>,

    private datasource: DataSource,
  ) {}

  async create(createOrderLineDto: CreateOrderLineDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        const sparePart = await this.getSparePartOrFail(
          entityManager,
          createOrderLineDto.spare_part_id,
        );

        const sparePartOrder = await this.getSparePartOrderOrFail(
          entityManager,
          createOrderLineDto.spare_part_order_id,
        );

        if (sparePartOrder.type == 'out') {
          sparePart.stock -= createOrderLineDto.quantity;
        } else {
          sparePart.stock += createOrderLineDto.quantity;
        }

        await entityManager.save(sparePart);

        const orderLine = entityManager.create(OrderLine, {
          ...createOrderLineDto,
          sparePart,
          sparePartOrder,
        });

        await entityManager.save(orderLine);
        return orderLine;
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return this.orderLineRepository.find();
  }

  async findOne(id: string) {
    const orderLine = await this.orderLineRepository.findOneBy({ id });

    if (!orderLine) {
      throw new NotFoundException(`OrderLine #${id} not found`);
    }
    return orderLine;
  }

  async update(id: string, updateOrderLineDto: UpdateOrderLineDto) {
    return await this.datasource.transaction(async (entityManager) => {
      const orderLine = await this.getOrderLineOrFail(entityManager, id);

      const sparePart = await this.getSparePartOrFail(
        entityManager,
        updateOrderLineDto.spare_part_id,
      );

      const sparePartOrder = await this.getSparePartOrderOrFail(
        entityManager,
        updateOrderLineDto.spare_part_order_id,
      );

      entityManager.merge(OrderLine, orderLine, {
        ...updateOrderLineDto,
        sparePart,
        sparePartOrder,
      });

      await entityManager.save(orderLine);
      return orderLine;
    });
  }

  async remove(id: string) {
    const orderLine = await this.orderLineRepository.findOneBy({ id });

    if (!orderLine) {
      throw new NotFoundException(`OrderLine #${id} not found`);
    }

    await this.orderLineRepository.remove(orderLine);
    return `order line #${id} removed`;
  }

  private async getSparePartOrFail(entityManager: EntityManager, id: string) {
    const sparePart = await entityManager.findOne(SparePart, { where: { id } });
    if (!sparePart) {
      throw new NotFoundException(`SparePart #${id} not found`);
    }
    return sparePart;
  }

  private async getSparePartOrderOrFail(
    entityManager: EntityManager,
    id: string,
  ) {
    const sparePartOrder = await entityManager.findOne(SparePartOrder, {
      where: { id },
    });
    if (!sparePartOrder) {
      throw new NotFoundException(`SparePartOrder #${id} not found`);
    }
    return sparePartOrder;
  }

  private async getOrderLineOrFail(entityManager: EntityManager, id: string) {
    const orderLine = await entityManager.findOne(OrderLine, { where: { id } });
    if (!orderLine) {
      throw new NotFoundException(`OrderLine #${id} not found`);
    }
    return orderLine;
  }
}
