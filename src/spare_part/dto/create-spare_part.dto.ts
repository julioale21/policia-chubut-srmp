import { IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator';

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

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  compatibility_vehicle: string[];

  @IsNotEmpty()
  @IsPositive()
  stock: number;
}
