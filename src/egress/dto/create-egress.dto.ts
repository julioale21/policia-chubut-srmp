import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEgressDto {
  @IsDate()
  @IsOptional()
  date: Date;

  @IsOptional()
  @IsString()
  observations: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  mechanic_boss_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  mechanic_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  movile_id: string;
}
