import { PageMetaDto } from './page-meta-dto';

export class PageDto<T> {
  constructor(
    private readonly data: T[], //
    private readonly meta: PageMetaDto,
  ) {}
}
