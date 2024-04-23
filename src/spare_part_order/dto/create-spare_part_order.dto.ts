import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum OrderType {
  in = 'in',
  out = 'out',
}

export class OrderLineDto {
  @IsString()
  @IsUUID(4)
  spare_part_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateSparePartOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  order_number: string;

  @IsDate()
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsEnum(OrderType)
  @IsNotEmpty()
  type: OrderType;

  @IsString()
  @IsOptional()
  provider_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  spare_part_items: OrderLineDto[];
}
