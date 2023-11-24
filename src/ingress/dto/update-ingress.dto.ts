import { PartialType } from '@nestjs/mapped-types';
import { CreateIngressDto } from './create-ingress.dto';

export class UpdateIngressDto extends PartialType(CreateIngressDto) {}
