import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipementIngressDto } from './create-equipement-ingress.dto';

export class UpdateEquipementIngressDto extends PartialType(
  CreateEquipementIngressDto,
) {}
