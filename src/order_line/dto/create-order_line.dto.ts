import {
  IsDecimal,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderLineDto {
  @IsDecimal()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  spare_part_id: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  spare_part_order_id: string;
}
