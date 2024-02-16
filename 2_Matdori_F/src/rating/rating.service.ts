import { BadRequestException, Injectable } from '@nestjs/common';
import { Rating } from './entity/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';
import { RatingException } from './classes/rating.exception.message';

@Injectable()
export class RatingService {
	constructor(
		@InjectRepository(Rating)
		private readonly ratingRepository: Repository<Rating>,
		@InjectRepository(Restaurant)
		private readonly restaurantRepository: Repository<Restaurant>,
	) {}

	async isRestaurantExist(option: FindOptionsWhere<Restaurant>) {
		return this.restaurantRepository.exist({ where: option });
	}

	async findRestaurant(option: FindOptionsWhere<Restaurant>): Promise<Restaurant | null> {
		return await this.restaurantRepository.findOne({ where: option });
	}

	async createRating(user: User, createRatingDto: CreateRatingDto) {
		const { restaurant_id, rating, content } = createRatingDto;

		const isExist = await this.isRestaurantExist({ id: restaurant_id });
		if (!isExist) throw new BadRequestException(RatingException.RATING_NOT_EXISTS);

		const restaurant = await this.findRestaurant({ id: restaurant_id });
		await this.updateRatingFromRetaurant(restaurant, rating);

		const newRating = this.ratingRepository.create({
			restaurant: restaurant,
			user: user,
			rating: rating,
			content: content,
		});

		await this.ratingRepository.save(newRating);

		const propertiesToInitialize = ['restaurant', 'user', 'deletedAt', 'id', 'createdAt', 'updatedAt'];
		propertiesToInitialize.forEach((property) => (newRating[property] = undefined));

		return newRating;
	}

	/**
	 * todo: count가 왜 안먹는지 확인해봐야함
	 * todedone: count를 사용하여 리팩토링하기
	 */
	async updateRatingFromRetaurant(restaurant: Restaurant, rating: number) {
		const restaurantId = restaurant.id;
		const crrentRating = restaurant.rating; //기존 평균값

		const crrentCount = await this.ratingRepository.count({ where: { restaurant: { id: restaurantId } } });

		const newRatingAvg = (crrentRating * crrentCount + rating) / (crrentCount + 1);
		const updateRatingAvg = parseFloat(newRatingAvg.toFixed(1));

		restaurant.rating = updateRatingAvg;
		await this.restaurantRepository.save(restaurant);
	}
}
