import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default class MainSeeder implements Seeder {
	async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
		const postsRepository = dataSource.getRepository(Post);
		const usersFactory = factoryManager.get(User);
		const postsFactory = factoryManager.get(Post);

		const users = await usersFactory.saveMany(10);
		const posts = await Promise.all(
			Array(50)
				.fill('')
				.map(async () => {
					const fakeUser = faker.helpers.arrayElement(users);
					const fakeHashTags = [`${fakeUser.account}`];
					fakeHashTags.push(...faker.helpers.arrayElements(['맛집', '성수동', '신림동', '분위기좋음']));
					return await postsFactory.make({
						hashtags: fakeHashTags,
						user: fakeUser,
					});
				}),
		);
		await postsRepository.save(posts);
	}
}
