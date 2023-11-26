import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipementDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
