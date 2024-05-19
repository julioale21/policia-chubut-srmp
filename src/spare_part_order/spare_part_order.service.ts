import { EntityManager, Repository } from 'typeorm';
import { Provider } from 'src/provider/entities/provider.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSparePartOrderDto,
  OrderType,
} from './dto/create-spare_part_order.dto';
import { UpdateSparePartOrderDto } from './dto/update-spare_part_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SparePartOrder } from './entities/spare_part_order.entity';
import { ProviderService } from 'src/provider/provider.service';
import { OrderLine } from 'src/order_line/entities/order_line.entity';

@Injectable()
export class SparePartOrderService {
  constructor(
    @InjectRepository(SparePartOrder)
    private sparePartOrderRepository: Repository<SparePartOrder>,

    private readonly providerService: ProviderService,
  ) {}

  async create(createSparePartOrderDto: CreateSparePartOrderDto) {
    try {
      return await this.sparePartOrderRepository.manager.transaction(
        async (entityManager) => {
          const { provider_id, spare_part_items, ...rest } =
            createSparePartOrderDto;

          let provider = null;
          if (provider_id && rest.type === OrderType.in) {
            provider = await this.providerService.findOne(provider_id);
            if (!provider) {
              throw new NotFoundException(`Provider #${provider_id} not found`);
            }
          }

          const sparePartOrder = entityManager.create(SparePartOrder, {
            ...rest,
            provider,
          });

          await entityManager.save(sparePartOrder);

          for (const item of spare_part_items) {
            const orderLine = entityManager.create(OrderLine, {
              sparePartOrder,
              sparePart: { id: item.spare_part_id },
              quantity: item.quantity,
            });

            await entityManager.save(orderLine);
          }

          for (const spare_part_item of spare_part_items) {
            await this.updateProductStock(
              spare_part_item.spare_part_id,
              entityManager,
            );
          }

          return await entityManager.findOne(SparePartOrder, {
            where: { id: sparePartOrder.id },
            relations: ['orderLines', 'provider'],
          });
        },
      );
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findAll() {
    return await this.sparePartOrderRepository.find({
      relations: ['provider'],
    });
  }

  async findOne(id: string) {
    const sparePartOrder = await this.sparePartOrderRepository.find({
      where: { id },
      relations: ['provider'],
    });

    if (!sparePartOrder) {
      throw new NotFoundException(`SparePartOrder #${id} not found`);
    }

    return sparePartOrder;
  }

  async update(id: string, updateSparePartOrderDto: UpdateSparePartOrderDto) {
    const { provider_id, ...rest } = updateSparePartOrderDto;

    let provider: Provider;

    if (provider_id) {
      provider = await this.providerService.findOne(provider_id);

      if (!provider) {
        throw new NotFoundException(`Provider #${provider_id} not found`);
      }
    }

    const sparePartOrder = await this.sparePartOrderRepository.findOneBy({
      id,
    });

    if (!sparePartOrder) {
      throw new NotFoundException(`SparePartOrder #${id} not found`);
    }

    await this.sparePartOrderRepository.update(id, {
      ...rest,
      provider,
    });

    return sparePartOrder;
  }

  async remove(id: string) {
    try {
      const sparePartOrder = await this.sparePartOrderRepository.findOneBy({
        id,
      });

      if (!sparePartOrder) {
        throw new NotFoundException(`SparePartOrder #${id} not found`);
      }

      await this.sparePartOrderRepository.remove(sparePartOrder);

      return `spare part order #${id} removed`;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  async updateProductStock(sparePartId: string, entityManager: EntityManager) {
    const orderLines = await entityManager
      .createQueryBuilder(OrderLine, 'line')
      .innerJoinAndSelect('line.sparePartOrder', 'order')
      .innerJoinAndSelect('line.sparePart', 'sparePart')
      .where('sparePart.id = :sparePartId', { sparePartId })
      .getMany();

    let totalQuantity = 0;
    let spare_part = null;

    orderLines.forEach((line) => {
      totalQuantity +=
        line.sparePartOrder.type === 'in' ? line.quantity : -line.quantity;
      if (!spare_part) {
        spare_part = line.sparePart;
      }
    });

    if (!spare_part) {
      throw new NotFoundException(`Product #${sparePartId} not found`);
    }
    spare_part.stock = totalQuantity;
    await entityManager.save(spare_part);

    return spare_part;
  }
}
