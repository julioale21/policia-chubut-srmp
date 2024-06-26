import { Transform } from 'class-transformer';
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

export enum IngressStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum IngressPriority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export class CreateIngressDto {
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
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
  movil_id: string;

  @IsString({ each: true })
  @IsUUID('4', { each: true })
  equipements: string[];

  @IsString()
  @IsOptional()
  status?: IngressStatus;

  @IsString()
  @IsOptional()
  priority?: IngressPriority;
}
