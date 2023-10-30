import { User } from '../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcryptjs';

export const UsersFactory = setSeederFactory(User, async (faker) => {
	const user = new User();
	user.email = faker.internet.email().replace(/[._-]/g, '').toLowerCase();
	user.account = faker.internet.userName().replace(/[._-]/g, '').toLowerCase();
	user.password = await bcrypt.hash(faker.string.alphanumeric({ length: 10 }) + faker.string.symbol(2), 10);
	user.signUpCode = faker.number.int({
		min: 100000,
		max: 999999,
	});
	return user;
});
