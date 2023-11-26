import { Injectable } from '@nestjs/common';
import { CreateSparePartOrderDto } from './dto/create-spare_part_order.dto';
import { UpdateSparePartOrderDto } from './dto/update-spare_part_order.dto';

@Injectable()
export class SparePartOrderService {
  create(createSparePartOrderDto: CreateSparePartOrderDto) {
    return 'This action adds a new sparePartOrder';
  }

  findAll() {
    return `This action returns all sparePartOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sparePartOrder`;
  }

  update(id: number, updateSparePartOrderDto: UpdateSparePartOrderDto) {
    return `This action updates a #${id} sparePartOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} sparePartOrder`;
  }
}
