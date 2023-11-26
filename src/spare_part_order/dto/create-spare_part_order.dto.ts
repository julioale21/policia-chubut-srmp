import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum OrderType {
  in = 'in',
  out = 'out',
}

export class CreateSparePartOrderDto {
  @IsString()
  @IsNotEmpty()
  @Min(1)
  order_number: string;

  @IsDate()
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  observations: string;

  @IsEnum(OrderType)
  @IsNotEmpty()
  type: OrderType;

  @IsString()
  @IsOptional()
  provider_id: string;
}
