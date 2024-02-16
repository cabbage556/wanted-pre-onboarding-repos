import { BaseEntity } from 'src/global/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Rating extends BaseEntity {
	@Column({ type: 'int' })
	rating: number;

	@Column()
	content: string;

	@ManyToOne(() => Restaurant)
	@JoinColumn({ name: 'restaurant_id' })
	restaurant: Restaurant;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
