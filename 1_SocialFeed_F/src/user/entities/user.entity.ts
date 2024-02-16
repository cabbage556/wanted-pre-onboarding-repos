import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/base.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
	@Column()
	email: string;

	@Column()
	account: string;

	@Column()
	@Exclude()
	password: string;

	@Column({ nullable: true })
	@Exclude()
	refreshToken: string;

	@Column()
	@Exclude()
	signUpCode: number;

	@Column({ default: false, type: 'bool', width: 1 })
	@Exclude()
	isCertify: boolean;
}
