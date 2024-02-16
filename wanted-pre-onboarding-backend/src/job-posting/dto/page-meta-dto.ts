import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../interface';

export class PageMetaDto {
  @ApiProperty({
    description: '페이지',
    default: 1,
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: '한 페이지에 보여줄 채용공고 갯수',
    default: 10,
    example: 10,
  })
  readonly take: number;

  @ApiProperty({
    description: '시작 페이지',
    example: 1,
  })
  readonly startPage: number;

  @ApiProperty({
    description: '마지막 페이지',
    example: 1,
  })
  readonly lastPage: number;

  @ApiProperty({
    description: '페이지 번호 배열(시작 페이지 ~ 마지막 페이지)',
    type: [Number],
    example: [1],
  })
  readonly pageList: number[];

  @ApiProperty({
    description: '이전 페이지 존재 여부',
    example: false,
  })
  readonly hasPrevPage: boolean;

  @ApiProperty({
    description: '다음 페이지 존재 여부',
    example: false,
  })
  readonly hasNextPage: boolean;

  constructor({ totalCounts, page, take }: PageMetaDtoParameters) {
    // page, take 값 설정
    //    음수 입력 시 기본값 1, 10 사용
    page = page <= 0 ? 1 : page;
    take = take <= 0 ? 10 : take;

    const PAGE_LIST_SIZE = 10; // 페이지에서 보여줄 최대 페이지 수
    const totalPage = Math.ceil(totalCounts / take); // 총 페이지 수
    let quotient = Math.floor(page / PAGE_LIST_SIZE); // 시작 페이지를 구하기 위한 몫
    if (page % PAGE_LIST_SIZE === 0) quotient -= 1;

    this.page = page;
    this.take = take;

    this.startPage = quotient * PAGE_LIST_SIZE + 1; // 페이지에서 보여줄 시작 페이지
    const endPage =
      this.startPage + PAGE_LIST_SIZE - 1 < totalPage
        ? this.startPage + PAGE_LIST_SIZE - 1
        : totalPage; // 페이지에서 보여줄 마지막 페이지
    this.lastPage = totalPage; // 총 페이지
    this.pageList = Array.from(
      { length: endPage - this.startPage + 1 },
      (_, i) => this.startPage + i,
    ); // 페이지에 표시할 페이지 번호 배열

    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < totalPage;
  }
}
