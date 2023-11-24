import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEquipementDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  observations: string;
}
