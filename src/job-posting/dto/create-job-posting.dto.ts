import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateJobPostingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  companyId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  position: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  rewards?: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  stack?: string;
}
