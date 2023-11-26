import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  name: string;
}
