import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { City } from './entity/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitysService implements OnModuleInit {
	constructor(
		@InjectRepository(City)
		private cityRepository: Repository<City>,
	) {}

	async onModuleInit() {
		const isExist = await this.cityRepository.exist({
			where: {
				city: '경기',
			},
		});

		if (!isExist) {
			await this.read('citys.csv');
		}
	}

	async read(path: string) {
		const stream = createReadStream(path);
		const raws = [];

		stream.on('data', (chunk) => {
			const data = chunk.toString();
			const lines = data.split('\n');

			for (const line of lines) {
				const rowData = line.split(',').map((item) => item.trim());
				raws.push(rowData);
			}
		});

		stream.on('end', async () => {
			for (const raw of raws) {
				const [city, sigunName, lon, lat] = raw;

				if (city !== 'do-si') {
					const newCity = this.cityRepository.create({
						city,
						sigunName,
						lat: Number(lat),
						lon: Number(lon),
					});

					await this.cityRepository.upsert(newCity, ['citySigunName']);
				}
			}
		});
	}

	getCities(): Promise<City[]> {
		return this.cityRepository.find();
	}
}
