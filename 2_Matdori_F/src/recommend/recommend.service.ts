import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UserLocations } from './interfaces/user-locations.interface';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import webhookConfiguration from 'src/global/configs/webhook.configuration';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RecommendService {
	constructor(
		private readonly usersService: UsersService,
		private readonly restaurantsService: RestaurantsService,
		@InjectRepository(Restaurant)
		private readonly restaurantRepository: Repository<Restaurant>,
		@Inject(webhookConfiguration.KEY)
		private readonly webhookConfig: ConfigType<typeof webhookConfiguration>,
	) {}

	@Cron('0 30 11 * * *')
	async sendLunchRecommendations() {
		const allUsers = await this.usersService.findAllUser();

		const usersWithLunchRecomm = allUsers.filter((user) => user.lunch_recomm);

		const usersData = usersWithLunchRecomm.map((user) => ({
			account: user.account,
			lat: user.lat,
			lon: user.lon,
		}));

		const recommendations = await Promise.all(usersData.map((user) => this.generateRecommendations(user)));

		const embeds = this.createEmbeds(usersData, recommendations);

		const result = this.createDiscordMessage(embeds);

		await this.sendDiscordMessage(result);
	}

	private createEmbeds(usersData, recommendations) {
		return usersData.map((user, idx) => {
			const userName = user.account;
			const userRecommendations = recommendations[idx].map((v) => {
				return {
					name: `${v.name}`,
					value: `
                    ${v.category}  𖤐${v.rating}\n
                    주소: ${v.roadAddress}
                    `,
				};
			});

			return {
				author: { name: `${userName}님` },
				fields: userRecommendations,
			};
		});
	}

	private createDiscordMessage(embeds) {
		return {
			username: '점심봇',
			avatar_url:
				'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA2MTNfMTM5%2FMDAxNjU1MDk1MDg2Mjk4.0-2SIkWb0F0wYDg4vxqaqT8Y-Zpi_3cvFyfa3Gf4MOEg.rnc98iP66Wyv9VYpi9pD_Fq_IZF-8eXajU_88jV41d8g.JPEG.windysky70%2FIMG_5186.JPG&type=sc960_832',
			content: '반경 500m 이내 랜덤 맛집',
			embeds: embeds,
		};
	}

	async sendDiscordMessage(result) {
		try {
			const response = await fetch(this.webhookConfig.webhook.url, {
				method: 'POST',
				body: JSON.stringify(result),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) throw new Error(`메시지 전송에 실패했습니다. Status code: ${response.status}`);

			console.log('메시지가 전송되었습니다.');
		} catch (err) {
			console.error('메시지 전송 중 오류 발생: ', err);
		}
	}

	async generateRecommendations(user: UserLocations) {
		const range = 0.5;
		const { lat, lon } = user;
		const recommendData = [];
		const qb = this.restaurantRepository.createQueryBuilder('restaurant');

		// range 이내 맛집 선택
		const distanceMap = new Map<string, number>();
		let restaurants = await qb.getMany();
		restaurants = this.restaurantsService.getRestaurantsWithinRange(distanceMap, restaurants, lon, lat, range);

		// range 이내 맛집 랜덤 셔플
		const randomRestaurants = this.getRandomRestaurants(restaurants, 5);

		for (const restaurant of randomRestaurants) {
			const { name, roadAddress, category, rating } = restaurant;
			const recommendItem = {
				name,
				roadAddress,
				category,
				rating,
			};
			recommendData.push(recommendItem);
		}
		return recommendData;
	}

	getRandomRestaurants(restaurants, num) {
		const shuffled = restaurants.slice(0);
		let i = restaurants.length;
		const min = i - num;
		let temp;
		let idx;

		while (i-- > min) {
			idx = Math.floor((i + 1) * Math.random()); // 무작위 인덱스 선택
			temp = shuffled[idx];
			shuffled[idx] = shuffled[i];
			shuffled[i] = temp;
		}

		return shuffled.slice(min);
	}
}
