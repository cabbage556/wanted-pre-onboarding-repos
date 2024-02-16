import { PageMetaDtoParameters } from '../interfaces/page-meta-dto-params.interface';

export class PageMetaDto {
	readonly page: number;
	readonly count: number;
	readonly startPage: number;
	readonly lastPage: number;
	readonly pageList: number[];
	readonly hasPrevPage: boolean;
	readonly hasNextPage: boolean;

	constructor({ totalCounts, page, count }: PageMetaDtoParameters) {
		const PAGE_LIST_SIZE = 10; // 페이지에서 보여줄 최대 페이지 수
		const totalPage = Math.ceil(totalCounts / count); // 총 페이지 수
		let quotient = Math.floor(page / PAGE_LIST_SIZE); // 시작 페이지를 구하기 위한 몫
		if (page % PAGE_LIST_SIZE === 0) quotient -= 1;

		this.page = page;
		this.count = count;

		this.startPage = quotient * PAGE_LIST_SIZE + 1; // 페이지에서 보여줄 시작 페이지
		const endPage =
			this.startPage + PAGE_LIST_SIZE - 1 < totalPage ? this.startPage + PAGE_LIST_SIZE - 1 : totalPage; // 페이지에서 보여줄 마지막 페이지
		this.lastPage = totalPage; // 총 페이지
		this.pageList = Array.from({ length: endPage - this.startPage + 1 }, (_, i) => this.startPage + i); // 페이지에 표시할 페이지 번호 배열

		this.hasPrevPage = this.page > 1;
		this.hasNextPage = this.page < totalPage;
	}
}
