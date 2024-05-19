import {
  IsArray,
  IsNotEmpty,
  IsOptional,
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
  code: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  compatible_vehicles: string[];

  @IsOptional()
  @IsPositive()
  stock?: number;
}
