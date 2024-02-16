import { Inject, Injectable, Logger } from '@nestjs/common';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import openApiConfiguration from 'src/global/configs/open-api.configuration';
import { ConfigType } from '@nestjs/config';
import { OpenApiOptions } from './interfaces/open-api-options.interface';
import { Category } from 'src/global/enums/category.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenApiRaws } from 'src/global/entities/open-api-raws.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Row } from './interfaces/row.interface';
import { Cron } from '@nestjs/schedule';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';
import { BusinessState } from 'src/global/enums/business-state.enum';
import { RestaurantCategory } from 'src/restaurants/enums/restaurant-category.enum';

@Injectable()
export class ScheduleService {
	private reapeatCount = 20;
	private logger = new Logger(ScheduleService.name);

	constructor(
		private readonly httpService: HttpService,
		@Inject(openApiConfiguration.KEY)
		private apiConfig: ConfigType<typeof openApiConfiguration>,
		@InjectRepository(OpenApiRaws)
		private rawsRepository: Repository<OpenApiRaws>,
		@InjectRepository(Restaurant)
		private restaurantRepository: Repository<Restaurant>,
	) {}

	job(options: OpenApiOptions) {
		const observables = Array(this.reapeatCount)
			.fill(0)
			.map(() =>
				this.call({ pageIndex: options.pageIndex++, type: options.type, pagePerRow: options.pagePerRow }),
			);

		forkJoin(observables).subscribe({
			next: (res: any) => {
				for (const data of res) {
					if (!data.RESULT) {
						if (data.Genrestrtjpnfood) this.saveAsRaws(data.Genrestrtjpnfood[1].row);
						if (data.Genrestrtlunch) this.saveAsRaws(data.Genrestrtlunch[1].row);
						if (data.Genrestrtchifood) this.saveAsRaws(data.Genrestrtchifood[1].row);
					}
				}
			},
		});
	}

	@Cron('0 19 * * *')
	private cronJob() {
		this.job({ pageIndex: 1, pagePerRow: 1000, type: Category.JAPANESE });
		this.job({ pageIndex: 1, pagePerRow: 1000, type: Category.KOREAN });
		this.job({ pageIndex: 1, pagePerRow: 1000, type: Category.CHINESE });
	}

	private call(options: OpenApiOptions) {
		const url = this.urlGenerator(options);
		return from(this.httpService.get(url)).pipe(map((response) => response.data));
	}

	private urlGenerator(options: OpenApiOptions) {
		const { type, pageIndex, pagePerRow, sigunName, sigunCode } = options;
		let baseUrl = '';

		if (type === Category.JAPANESE) baseUrl = this.apiConfig.japanese.requestUrl;
		if (type === Category.CHINESE) baseUrl = this.apiConfig.chinese.requestUrl;
		if (type === Category.KOREAN) baseUrl = this.apiConfig.korean.requestUrl;

		if (pageIndex) baseUrl += `&pIndex=${pageIndex}`;
		if (pagePerRow) baseUrl += `&pSize=${pagePerRow}`;
		if (sigunCode) baseUrl += `&SIGUN_CD=${sigunCode}`;
		if (sigunName) baseUrl += `&SIGUN_NM=${sigunName}`;

		return baseUrl;
	}

	@Cron('5 19 * * *')
	private async saveAsRestaurant() {
		const raws = await this.dataPreprocess();

		for (const raw of raws) {
			const newRestaurant = this.restaurantRepository.create({
				address: raw.address,
				status: raw.state,
				lat: raw.lat,
				lon: raw.lon,
				roadAddress: raw.roadAddress,
				name: raw.name,
				category: raw.category,
			});

			await this.restaurantRepository.upsert(newRestaurant, ['name']);
		}
	}

	private async dataPreprocess() {
		const raws = await this.rawsRepository.find({
			select: {
				name: true,
				state: true,
				lat: true,
				lon: true,
				roadAddress: true,
				address: true,
				category: true,
				nameAddress: true,
			},
			where: {
				state: Not(BusinessState.CLOSED),
				lat: Not(IsNull()),
				lon: Not(IsNull()),
			},
		});

		return raws;
	}

	private async saveAsRaws(rows: Row[]) {
		for (const row of rows) {
			try {
				let category: RestaurantCategory;

				if (row.SANITTN_BIZCOND_NM === '김밥(도시락)') category = RestaurantCategory.KOREAN;
				if (row.SANITTN_BIZCOND_NM === '중국식') category = RestaurantCategory.CHINESE;
				if (row.SANITTN_BIZCOND_NM === '일식') category = RestaurantCategory.JAPANESE;

				const newRaw = this.rawsRepository.create({
					sigunName: row.SIGUN_NM,
					sigunCode: row.SIGUN_CD,
					name: row.BIZPLC_NM,
					license: row.LICENSG_DE,
					state: row.BSN_STATE_NM,
					closedDate: row.CLSBIZ_DE,
					maleWorkers: row.MALE_ENFLPSN_CNT,
					femaleWorkers: row.FEMALE_ENFLPSN_CNT,
					zoningName: row.BSNSITE_CIRCUMFR_DIV_NM,
					category,
					totalEmploymentCount: row.TOT_EMPLY_CNT,
					roadAddress: row.REFINE_ROADNM_ADDR,
					address: row.REFINE_LOTNO_ADDR,
					zipCode: row.REFINE_ZIP_CD,
					lat: row.REFINE_WGS84_LAT,
					lon: row.REFINE_WGS84_LOGT,
				});

				await this.rawsRepository.upsert(newRaw, ['nameAddress']);
			} catch (error) {
				this.logger.error(error);
			}
		}
	}
}
