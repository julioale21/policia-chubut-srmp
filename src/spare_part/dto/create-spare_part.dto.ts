import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsArray({ each: true })
  @IsNotEmpty()
  compatibility_vehicle: string[];

  @IsDecimal()
  @IsNotEmpty()
  @IsPositive()
  stock: number;
}
