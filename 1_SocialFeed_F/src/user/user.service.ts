import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UsersException } from 'src/commons/exception.message';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginDto } from './dto/login.dto';
import { TokenPayload } from 'src/commons/interfaces/token.payload';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async isUserExist(options: FindOptionsWhere<User>): Promise<boolean> {
		return this.userRepository.exist({ where: options });
	}

	async login(loginDto: LoginDto) {
		const { account, password } = loginDto;

		const isExist = await this.isUserExist({ account });

		if (isExist) {
			const user = await this.findOne({ account });

			if (!user.isCertify) throw new BadRequestException(UsersException.USER_NOT_CERTIFIED);

			const isMatched = await bcrypt.compare(password, user.password);

			if (isMatched) {
				const accessToken = this.jwtService.generateAccessToken({ id: user.id, account: user.account });
				const refreshToken = this.jwtService.generateRefreshToken({ id: user.id, account: user.account });

				await this.userRepository.update({ account }, { refreshToken });

				return {
					accessToken,
					refreshToken,
				};
			}

			throw new BadRequestException(UsersException.USER_PASSWORD_NOT_MATCHED);
		}

		throw new BadRequestException(UsersException.USER_NOT_EXISTS);
	}

	async refresh(user: User) {
		const payload: TokenPayload = { id: user.id, account: user.account };
		return {
			accessToken: this.jwtService.generateAccessToken(payload),
		};
	}

	async logout(user: User) {
		await this.userRepository.update({ id: user.id }, { refreshToken: null });
	}

	async findOne(options: FindOptionsWhere<User>): Promise<User | null> {
		return await this.userRepository.findOne({ where: options });
	}

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		const { account, password, email } = createUserDto;

		const isExist = await this.isUserExist({ account });
		if (isExist) throw new BadRequestException(UsersException.USER_ACCOUNT_ALREADY_EXISTS);

		const signUpCode = this.generateSignUpCode();
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = this.userRepository.create({
			account,
			password: hashedPassword,
			email,
			signUpCode,
		});

		await this.userRepository.save(newUser);

		newUser.createdAt = undefined;
		newUser.updatedAt = undefined;
		newUser.id = undefined;

		return newUser;
	}

	generateSignUpCode() {
		const min = 100000;
		const max = 999999;
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async approveUser(approveUserDto: ApproveUserDto) {
		const { account, password, signupCode } = approveUserDto;

		const user = await this.findOne({ account });
		if (!user) throw new BadRequestException(UsersException.USER_NOT_EXISTS);

		if (user.isCertify) throw new BadRequestException(UsersException.USER_ALREADY_CERTIFIED);

		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched) throw new BadRequestException(UsersException.USER_PASSWORD_NOT_MATCHED);

		const isSignupCodeMatched = user.signUpCode === parseInt(signupCode);
		if (!isSignupCodeMatched) throw new BadRequestException(UsersException.USER_SIGNUPCODE_NOT_MATCHED);

		await this.userRepository.update({ id: user.id }, { isCertify: true });
	}
}
