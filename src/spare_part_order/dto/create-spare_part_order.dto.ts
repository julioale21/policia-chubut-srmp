import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum OrderType {
  in = 'in',
  out = 'out',
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
}
