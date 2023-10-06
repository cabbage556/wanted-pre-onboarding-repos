import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetJobPostingsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  take?: number = 10;
}
