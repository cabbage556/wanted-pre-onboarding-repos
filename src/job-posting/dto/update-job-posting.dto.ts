import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateJobPostingDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsInt()
  rewards?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  stack?: string;
}
