import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, Length } from 'class-validator';

export class SearchJobPostingsDto {
  @ApiProperty({
    description: '검색 키워드',
    minLength: 1,
    maxLength: 100,
    example: '원티드랩',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100) // 1글자부터 position 필드 최대 길이 100글자까지
  search: string;

  @ApiProperty({
    description:
      '검색 필드, 회사 이름 검색(company), 채용포지션 검색(position)',
    example: 'company',
  })
  @IsIn(['position', 'company'])
  field: string;
}
