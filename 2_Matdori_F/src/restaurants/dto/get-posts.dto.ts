import {
	IsEnum,
	IsInt,
	IsLatitude,
	IsLongitude,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	Max,
} from 'class-validator';
import {
	RestaurantQueryOrder,
	RestaurantQueryOrderBy,
	RestaurantQueryRange,
	RestaurantQuerySearchBy,
} from '../enums/restaurant-query.enum';
import { Type } from 'class-transformer';

export class GetPostsDto {
	@IsNotEmpty({ message: 'lat 필드는 필수 입력 필드입니다.' })
	@IsLatitude({ message: 'lat 필드에 유효한 위도를 입력해야 합니다.' })
	lat: number;

	@IsNotEmpty({ message: 'lon 필드는 필수 입력 필드입니다.' })
	@IsLongitude({ message: 'lon 필드에 유효한 경도를 입력해야 합니다.' })
	lon: number;

	@Type(() => Number)
	@IsNotEmpty({ message: 'range 필드는 필수 입력 필드입니다.' })
	@IsEnum(RestaurantQueryRange, {
		message: `range 필드에 전달 가능한 값: [${RestaurantQueryRange.ONE_KM}, ${RestaurantQueryRange.FIVE_KM}, ${RestaurantQueryRange.TEN_KM}]`,
	})
	range: number;

	@IsOptional()
	@IsEnum(RestaurantQueryOrderBy, {
		message: `orderBy 필드에 전달 가능한 값: [${RestaurantQueryOrderBy.DIST}, ${RestaurantQueryOrderBy.RATING}]`,
	})
	orderBy: RestaurantQueryOrderBy = RestaurantQueryOrderBy.DIST; // default: dist

	@IsOptional()
	@IsEnum(RestaurantQueryOrder, {
		message: `order 필드에 전달 가능한 값: [${RestaurantQueryOrder.DESC}, ${RestaurantQueryOrder.ASC}]`,
	})
	order: RestaurantQueryOrder = RestaurantQueryOrder.ASC; // default: asc

	@IsOptional()
	@IsEnum(RestaurantQuerySearchBy, {
		message: `searchBy 필드에 전달 가능한 값: [${RestaurantQuerySearchBy.NAME}, ${RestaurantQuerySearchBy.CATEGORY}]`,
	})
	searchBy?: RestaurantQuerySearchBy;

	@IsOptional()
	@IsString({ message: 'search 필드에 문자열을 입력해야 합니다.' })
	search?: string;

	@Type(() => Number)
	@IsOptional()
	@IsInt({ message: 'page 필드에 정수를 입력해야 합니다.' })
	@IsPositive({ message: 'page 필드에 1 이상의 정수를 입력해야 합니다.' })
	page = 1; // default: 1

	@Type(() => Number)
	@IsOptional()
	@IsInt({ message: 'count 필드에 정수를 입력해야 합니다.' })
	@IsPositive({ message: 'count 필드에 1 이상의 정수를 입력해야 합니다.' })
	@Max(20, { message: 'count 필드의 최대 값은 20입니다.' })
	count = 10; // default: 10
}
