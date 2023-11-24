import { IsString, MinLength } from 'class-validator';

export class CreateMechanicDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;
}
