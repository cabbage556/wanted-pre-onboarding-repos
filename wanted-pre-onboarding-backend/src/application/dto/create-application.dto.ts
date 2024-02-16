import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: '사용자id',
    minimum: 1,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: '채용공고id',
    minimum: 1,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  jobPostingId: number;
}
