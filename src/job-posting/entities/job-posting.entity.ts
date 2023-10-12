import { ApiProperty } from '@nestjs/swagger';
import { JobPosting } from '@prisma/client';

export class JobPostingEntity implements JobPosting {
  @ApiProperty({
    example: 1,
    minimum: 1,
  })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    example: 'NestJS 백엔드 개발자 모집 중....',
  })
  content: string;

  @ApiProperty({
    example: 'NestJS 백엔드 개발자',
  })
  position: string;

  @ApiProperty({
    default: null,
    example: '#NestJS',
  })
  stack: string;

  @ApiProperty({
    example: 500000,
  })
  rewards: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
  })
  companyId: number;
}
