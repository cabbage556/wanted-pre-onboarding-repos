import { ApiProperty } from '@nestjs/swagger';
import { JobPosting } from '@prisma/client';

export class JobPostingEntity implements JobPosting {
  @ApiProperty({
    description: '채용공고id',
    example: 1,
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '채용공고 생성 시간',
  })
  createdAt: Date;

  @ApiProperty({
    description: '채용공고 수정 시간',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '채용공고 내용',
    example: 'NestJS 백엔드 개발자 모집 중....',
  })
  content: string;

  @ApiProperty({
    description: '채용포지션',
    example: 'NestJS 백엔드 개발자',
  })
  position: string;

  @ApiProperty({
    description: '기술스택',
    default: null,
    example: '#NestJS',
  })
  stack: string;

  @ApiProperty({
    description: '채용보상금',
    example: 500000,
  })
  rewards: number;

  @ApiProperty({
    description: '회사id',
    example: 1,
    minimum: 1,
  })
  companyId: number;
}
