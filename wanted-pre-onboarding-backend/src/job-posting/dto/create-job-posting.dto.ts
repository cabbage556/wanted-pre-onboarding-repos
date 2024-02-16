import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateJobPostingDto {
  @ApiProperty({
    description: '회사id',
    minimum: 1,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  companyId: number;

  @ApiProperty({
    description: '채용포지션',
    minLength: 1,
    maxLength: 100,
    example: 'NestJS 백엔드 개발자',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  position: string;

  @ApiPropertyOptional({
    description: '채용보상금',
    minimum: 0,
    default: 0,
    example: 500000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  rewards?: number;

  @ApiProperty({
    description: '채용공고 내용',
    example: 'NestJS 백엔드 개발자 모집 중....',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: '기술스택',
    minimum: 1,
    maxLength: 100,
    default: null,
    example: '#NestJS',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  stack?: string;
}
