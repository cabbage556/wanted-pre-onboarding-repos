import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetJobPostingsDto {
  @ApiPropertyOptional({
    description: '페이지',
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: '한 페이지에 보여줄 채용공고 갯수',
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  take?: number = 10;
}
