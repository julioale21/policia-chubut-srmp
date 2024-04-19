import { IsOptional, IsPositive, Min } from 'class-validator';
export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @Min(0)
  page: number = 0;

  @IsOptional()
  searchTerm?: string;
}
