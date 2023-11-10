import { BaseEntity } from 'src/global';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	refreshToken: string;
}
