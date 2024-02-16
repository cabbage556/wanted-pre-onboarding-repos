import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { BaseEntity } from './commons/base.entity';
import { User } from './user/entities/user.entity';
import { UsersFactory } from './database/factories/users.factory';
import { PostsFactory } from './database/factories/posts.factory';
import MainSeeder from './database/seeds/main.seeder';
import { Post } from './post/entities/post.entity';

config({
	path: `.development.env`,
});
const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
	type: 'mysql',
	host: 'localhost',
	port: configService.getOrThrow<number>('MYSQL_PORT'),
	username: configService.getOrThrow('MYSQL_ROOT_USER'),
	password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
	database: configService.getOrThrow('MYSQL_DATABASE'),
	entities: [BaseEntity, User, Post],
	factories: [UsersFactory, PostsFactory],
	seeds: [MainSeeder],
};
const dataSource = new DataSource(options);

export default dataSource;
