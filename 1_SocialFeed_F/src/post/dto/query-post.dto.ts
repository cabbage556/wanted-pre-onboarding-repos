import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { SnsProvider } from 'src/commons/enums/sns-provider.enum';
import { OrderRole } from 'src/commons/enums/order-role.enum';
import { SearchRole } from 'src/commons/enums/search-role.enum';
import { Transform } from 'class-transformer';

export class PostsQueryDto {
	@Transform((params) => (params.value === '' ? null : params.value))
	@IsOptional()
	@IsString()
	@IsEnum(SnsProvider, {
		message:
			'type 쿼리값이 잘못되었습니다. 쿼리값의 종류는 ["FACEBOOK", "TWITTER", "INSTAGRAM", "THREADS"] 입니다.',
	})
	type: SnsProvider;

	@IsOptional()
	@IsString()
	hashtag: string;

	@Transform((params) => (params.value === '' ? OrderRole.createdAt : params.value))
	@IsOptional()
	@IsString()
	@IsEnum(OrderRole, {
		message:
			'orderBy 쿼리값이 잘못되었습니다. 쿼리값의 종류는 ["created_at", "updated_at", "like_count", "share_count", "view_count"] 입니다.',
	})
	orderBy: OrderRole;

	@Transform((params) => (params.value === '' ? 'desc' : params.value))
	@IsOptional()
	@IsIn(['asc', 'desc'], {
		message: 'order 쿼리값이 잘못되었습니다. 쿼리값의 종류는 ["asc", "desc"] 입니다.',
	})
	order: 'asc' | 'desc';

	@IsNumber()
	@IsOptional()
	page: number;

	@IsNumber()
	@IsOptional()
	pageCount: number;

	@IsOptional()
	@IsString()
	search: string;

	@Transform((params) => (params.value === '' ? 'title+content' : params.value))
	@IsOptional()
	@IsString()
	@IsEnum(SearchRole, {
		message: 'searchBy 쿼리값이 잘못되었습니다. 쿼리값의 종류는 ["title", "content", "title+content"] 입니다.',
	})
	searchBy: SearchRole;
}
