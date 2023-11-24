import {
  IsOptional,
  IsString,
  IsUUID,
  IsUppercase,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMovileDto {
  @IsString()
  @MinLength(6)
  @MaxLength(8)
  @IsUppercase()
  domain: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  dependencyId: string;

  @IsString()
  @IsOptional()
  dependencyDescription: string;
}
