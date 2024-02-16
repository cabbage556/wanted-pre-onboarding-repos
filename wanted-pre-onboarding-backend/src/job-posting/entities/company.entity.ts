import { ApiProperty } from '@nestjs/swagger';
import { Company } from '@prisma/client';

export class CompanyEntity implements Company {
  @ApiProperty({
    description: '회사id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '회사 이름',
    example: '원티드랩',
  })
  name: string;

  @ApiProperty({
    description: '회사 국가',
    example: '대한민국',
  })
  nationality: string;

  @ApiProperty({
    description: '회사 지역',
    example: '서울',
  })
  region: string;
}
