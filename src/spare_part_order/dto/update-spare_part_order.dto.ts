import { PartialType } from '@nestjs/mapped-types';
import { CreateSparePartOrderDto } from './create-spare_part_order.dto';

export class UpdateSparePartOrderDto extends PartialType(CreateSparePartOrderDto) {}
