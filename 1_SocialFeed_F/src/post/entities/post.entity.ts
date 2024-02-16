import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SnsProvider } from '../../commons/enums/sns-provider.enum';
import { BaseEntity } from '../../commons/base.entity';

@Entity()
export class Post extends BaseEntity {
	@Column({ type: 'enum', enum: SnsProvider })
	type: SnsProvider;

	@Column()
	title: string;

	@Column()
	content: string;

	@Column({ type: 'json' })
	hashtags: string[];

	@Column({ default: 0 })
	viewCount: number;

	@Column({ default: 0 })
	likeCount: number;

	@Column({ default: 0 })
	shareCount: number;

	@ManyToOne(() => User)
	user: User;
}
