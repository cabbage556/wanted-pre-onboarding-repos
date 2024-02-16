import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
	private readonly data: T[];
	private readonly meta: PageMetaDto;

	constructor(data: T[], meta: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
