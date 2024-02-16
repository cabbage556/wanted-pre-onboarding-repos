import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfiguration from '../configs/jwt.configuration';
import { ConfigType } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token.payload';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: config.refresh.secretKey,
		});
	}

	async validate(req: Request, payload: TokenPayload) {
		const refreshToken = req.headers.authorization.split(' ')[1];
		const isExist = await this.userService.isUserExist({ id: payload.id });

		if (isExist) {
			const user = await this.userService.findOne({ id: payload.id });

			const isMatched = refreshToken === user.refreshToken;
			if (isMatched) return user;
		}
	}
}
