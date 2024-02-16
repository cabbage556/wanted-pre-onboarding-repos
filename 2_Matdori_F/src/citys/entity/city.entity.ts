import { BaseEntity } from 'src/global/entities/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity({ name: 'citys' })
export class City extends BaseEntity {
	@Column()
	city: string;

	@Column({ name: 'sigun_name', comment: '시 군 이름' })
	sigunName: string;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 10,
	})
	lat: number;

	@Column({
		type: 'numeric',
		precision: 13,
		scale: 10,
	})
	lon: number;

	@Column({ unique: true })
	citySigunName: string;

	@BeforeInsert()
	transform() {
		this.citySigunName = this.city + '_' + this.sigunName;
	}
}
