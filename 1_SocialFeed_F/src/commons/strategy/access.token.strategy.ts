import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfiguration from '../configs/jwt.configuration';
import { ConfigType } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token.payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.access.secretKey,
		});
	}

	async validate(payload: TokenPayload) {
		const isExist = await this.userService.isUserExist({ id: payload.id });

		if (isExist) return await this.userService.findOne({ id: payload.id });
	}
}
