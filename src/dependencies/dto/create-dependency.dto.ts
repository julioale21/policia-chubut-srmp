import { IsString, MinLength } from 'class-validator';

export class CreateDependencyDto {
  @IsString()
  @MinLength(10)
  description: string;
}
