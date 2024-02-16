import { BaseEntity } from 'src/global/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RestaurantCategory } from '../enums/restaurant-category.enum';
import { BusinessState } from 'src/global/enums/business-state.enum';
import { Rating } from 'src/rating/entity/rating.entity';

@Entity()
export class Restaurant extends BaseEntity {
	@Column({ unique: true })
	name: string;

	@Column({
		type: 'enum',
		enum: BusinessState,
	})
	status: BusinessState;

	@Column({
		type: 'numeric',
		precision: 12, // 38.0362201660
		scale: 10,
	})
	lat: number;

	@Column({
		type: 'numeric',
		precision: 13, // 127.3675276602
		scale: 10,
	})
	lon: number;

	@Column({
		type: 'double precision',
		default: 0,
	})
	rating: number;

	@Column({
		name: 'road_address',
		comment: '도로명 주소',
		nullable: true,
	})
	roadAddress: string;

	@Column({ comment: '지번주소' })
	address: string;

	@Column({
		type: 'enum',
		enum: RestaurantCategory,
	})
	category: RestaurantCategory;

	@OneToMany(() => Rating, (rating) => rating.restaurant)
	ratings: Rating[];
}
