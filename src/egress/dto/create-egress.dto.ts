import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class SparePartDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  quantity: number;
}

export class CreateEgressDto {
  @IsDate()
  @IsOptional()
  date: Date;

  @IsOptional()
  @IsString()
  observations: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  order_number: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  mechanic_boss_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  mechanic_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  movil_id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  ingress_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SparePartDto)
  spare_parts: SparePartDto[];
}
