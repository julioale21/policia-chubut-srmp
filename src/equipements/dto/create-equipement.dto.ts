import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEquipementDto {
  @IsBoolean()
  @IsOptional()
  car_jack: boolean;

  @IsBoolean()
  @IsOptional()
  weel_wrench: boolean;

  @IsBoolean()
  @IsOptional()
  fire_stinguisher: boolean;

  @IsBoolean()
  @IsOptional()
  reflective_vest: boolean;

  @IsBoolean()
  @IsOptional()
  beacons: boolean;

  @IsBoolean()
  @IsOptional()
  communication_equipment: boolean;

  @IsBoolean()
  @IsOptional()
  radio_antenna: boolean;

  @IsBoolean()
  @IsOptional()
  stereo: boolean;

  @IsBoolean()
  @IsOptional()
  trailer_line: boolean;

  @IsBoolean()
  @IsOptional()
  spare_wheel: boolean;

  @IsString()
  @IsOptional()
  observations: string;
}
