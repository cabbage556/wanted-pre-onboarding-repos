import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entity/restaurant.entity';
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { RestaurantException } from './enums/restaurant-exception.enum';
import { GetPostsDto } from './dto/get-posts.dto';
import { latLonToKm } from 'src/global/utils/lat-lon-to-km';
import { RestaurantQueryOrder, RestaurantQueryOrderBy, RestaurantQuerySearchBy } from './enums/restaurant-query.enum';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageDto } from './dto/page.dto';
import { getEnumKeys } from 'src/global/utils/get-enum-keys';
import { RestaurantCategory } from './enums/restaurant-category.enum';

@Injectable()
export class RestaurantsService {
	private restaurant = 'restaurant';

	constructor(
		@InjectRepository(Restaurant)
		private readonly restaurantRepository: Repository<Restaurant>,
	) {}

	searchByName(qb: SelectQueryBuilder<Restaurant>, search: string) {
		qb.where(`name like '%' || :search || '%'`, { search });
	}

	searchByCategory(qb: SelectQueryBuilder<Restaurant>, search: string) {
		let canSearch = false;
		for (const key of getEnumKeys(RestaurantCategory)) {
			const category = RestaurantCategory[key];
			if (category === search) {
				canSearch = true;
				break;
			}
		}
		if (!canSearch) throw new BadRequestException(RestaurantException.CANNOT_SEARCH_CATEGORY);

		qb.where('category = :search', { search });
	}

	orderByRating(qb: SelectQueryBuilder<Restaurant>, order: RestaurantQueryOrder) {
		qb.addOrderBy(`rating`, order === RestaurantQueryOrder.DESC ? 'DESC' : 'ASC');
	}

	getRestaurantsWithinRange(
		distanceMap: Map<string, number>,
		restaurants: Restaurant[],
		lon: number,
		lat: number,
		range: number,
	): Restaurant[] {
		return restaurants.filter((restaurant) => {
			const distance = latLonToKm({ point1: [lon, lat], point2: [restaurant.lon, restaurant.lat] });
			if (distance < range) {
				distanceMap.set(restaurant.id, distance);
				return true;
			}
			return false;
		});
	}

	orderByDistance(distanceMap: Map<string, number>, restaurants: Restaurant[], order: RestaurantQueryOrder) {
		restaurants.sort((a, b) => {
			if (order === RestaurantQueryOrder.ASC) return distanceMap.get(a.id) - distanceMap.get(b.id);
			else return distanceMap.get(b.id) - distanceMap.get(a.id);
		});
	}

	async getPosts(getPostsDto: GetPostsDto) {
		const { lat, lon, range, orderBy, order, searchBy, search, page, count } = getPostsDto;
		const qb = this.restaurantRepository.createQueryBuilder(this.restaurant);

		// 검색 기준에 따라 검색
		if (searchBy === RestaurantQuerySearchBy.NAME) this.searchByName(qb, search);
		else if (searchBy === RestaurantQuerySearchBy.CATEGORY) this.searchByCategory(qb, search);

		// 정렬 기준에 따라 정렬
		if (orderBy === RestaurantQueryOrderBy.RATING) this.orderByRating(qb, order);

		// range 안쪽에 있는 맛집 선택
		const distanceMap = new Map<string, number>();
		let restaurants = await qb.getMany();
		restaurants = this.getRestaurantsWithinRange(distanceMap, restaurants, lon, lat, range);

		// 거리 기준 정렬
		if (orderBy === RestaurantQueryOrderBy.DIST) this.orderByDistance(distanceMap, restaurants, order);

		// 페이지네이션
		const pageMeta = new PageMetaDto({ totalCounts: restaurants.length, page, count });
		restaurants = restaurants.slice((page - 1) * count, (page - 1) * count + count);
		if (pageMeta.lastPage >= pageMeta.page) return new PageDto<Restaurant>(restaurants, pageMeta);
		else throw new ConflictException(RestaurantException.INVALID_PAGE);
	}

	findOneBy(where: FindOptionsWhere<Restaurant>): Promise<Restaurant> {
		return this.restaurantRepository.findOneBy(where);
	}

	isRestaurantExist(where: FindOptionsWhere<Restaurant>): Promise<boolean> {
		return this.restaurantRepository.exist({ where });
	}

	async findOne(id: string): Promise<Restaurant> {
		const isExist = await this.isRestaurantExist({ id });
		if (!isExist) throw new NotFoundException(RestaurantException.NOT_FOUND);

		return await this.restaurantRepository
			.createQueryBuilder(this.restaurant)
			.where('restaurant.id = :id', { id })
			.leftJoin('restaurant.ratings', 'ratings')
			.loadRelationCountAndMap('restaurant.ratingsCount', 'restaurant.ratings')
			.getOne();
	}
}
