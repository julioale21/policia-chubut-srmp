import { PartialType } from '@nestjs/mapped-types';
import { CreateMovileDto } from './create-movile.dto';

export class UpdateMovileDto extends PartialType(CreateMovileDto) {}
