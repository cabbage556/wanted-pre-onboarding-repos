import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta-dto';

export class PageDto<T> {
  @ApiProperty({
    description: '채용공고 목록',
  })
  private readonly data: T[];

  @ApiProperty({
    description: '페이지네이션 메타데이터',
  })
  private readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
