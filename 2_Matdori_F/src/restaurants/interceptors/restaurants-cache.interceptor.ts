import { CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { Restaurant } from '../entity/restaurant.entity';
import {
	CACHEABLE_RESTAURANT_RATING,
	CACHEABLE_RESTAURANT_RATING_COUNTS,
	RESTAURANTS_FIND_ONE,
} from '../constants/restaurants-cache.constants';

@Injectable()
export class RestaurantsCacheInterceptor implements NestInterceptor {
	constructor(
		@Inject('Reflector') private readonly reflector: Reflector,
		private readonly cacheService: CacheService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();
		const splitUrl = request.originalUrl.split('/');
		const baseKey = `${RESTAURANTS_FIND_ONE}:`; // restaurants:findOne:
		const ttl = this.reflector.get(CACHE_TTL_METADATA, context.getHandler()); // 600000(600초)

		try {
			// 캐시 결과 리턴
			const cachedRestaurant = await this.cacheService.get(baseKey + `${splitUrl[splitUrl.length - 1]}`); // restaurants:findOne:id
			if (cachedRestaurant) return of(cachedRestaurant);

			// 캐시 결과가 없으면 DB에서 조회해 리턴하면서 캐싱
			return next.handle().pipe(
				tap((res) => {
					// 캐싱 조건에 부합한다면 캐싱
					if (this.isCacheable(res)) this.cacheService.set(baseKey + `${res.id}`, res, ttl);
				}),
			);
		} catch {
			// cacheService에서 에러가 발생하는 경우 DB에서 조회
			return next.handle();
		}
	}

	isCacheable(restaurant: Restaurant): boolean {
		// 맛집 평점이 4.8점보다 작으면 캐싱하지 않음
		if (restaurant.rating < CACHEABLE_RESTAURANT_RATING) return false;

		// 맛집 평점 갯수가 100개보다 작으면 캐싱하지 않음
		const ratingsCount = restaurant['ratingsCount'] ?? 0;
		if (ratingsCount < CACHEABLE_RESTAURANT_RATING_COUNTS) return false;

		return true;
	}
}
