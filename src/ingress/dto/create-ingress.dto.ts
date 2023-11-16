import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateIngressDto {
  @IsDate()
  @IsOptional()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  kilometers: number;

  @IsString()
  @IsOptional()
  repair_description: string;

  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  fuel_level: number;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  movile_id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  equipement_id: string;
}
