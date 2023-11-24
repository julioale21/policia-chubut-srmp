import { PartialType } from '@nestjs/mapped-types';
import { CreateEgressDto } from './create-egress.dto';

export class UpdateEgressDto extends PartialType(CreateEgressDto) {}
