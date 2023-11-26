import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSparePartOrderDto } from './dto/create-spare_part_order.dto';
import { UpdateSparePartOrderDto } from './dto/update-spare_part_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SparePartOrder } from './entities/spare_part_order.entity';
import { Repository } from 'typeorm';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class SparePartOrderService {
  constructor(
    @InjectRepository(SparePartOrder)
    private sparePartOrderRepository: Repository<SparePartOrder>,

    private readonly providerService: ProviderService,
  ) {}

  async create(createSparePartOrderDto: CreateSparePartOrderDto) {
    const { provider_id, ...rest } = createSparePartOrderDto;

    const provider = await this.providerService.findOne(provider_id);

    if (!provider) {
      throw new NotFoundException(`Provider #${provider_id} not found`);
    }

    const sparePartOrder = this.sparePartOrderRepository.create({
      ...rest,
      provider,
    });

    await this.sparePartOrderRepository.save(sparePartOrder);

    return sparePartOrder;
  }

  async findAll() {
    return await this.sparePartOrderRepository.find({
      relations: ['provider', 'orderLines'],
    });
  }

  async findOne(id: string) {
    const sparePartOrder = await this.sparePartOrderRepository
      .createQueryBuilder('sparePartOrder')
      .leftJoinAndSelect('sparePartOrder.user', 'user')
      .leftJoinAndSelect('sparePartOrder.items', 'items')
      .where('sparePartOrder.id = :id', { id })
      .getOne();

    if (!sparePartOrder) {
      throw new NotFoundException(`SparePartOrder #${id} not found`);
    }

    return sparePartOrder;
  }

  async update(id: string, updateSparePartOrderDto: UpdateSparePartOrderDto) {
    const { provider_id, ...rest } = updateSparePartOrderDto;

    const provider = await this.providerService.findOne(provider_id);

    if (!provider) {
      throw new NotFoundException(`Provider #${provider_id} not found`);
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
    const sparePartOrder = await this.sparePartOrderRepository.findOneBy({
      id,
    });

    if (!sparePartOrder) {
      throw new NotFoundException(`SparePartOrder #${id} not found`);
    }

    await this.sparePartOrderRepository.delete(id);

    return `spare part order #${id} removed`;
  }
}
