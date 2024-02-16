import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService as Jwt } from '@nestjs/jwt';
import jwtConfiguration from 'src/commons/configs/jwt.configuration';
import { TokenPayload } from 'src/commons/interfaces/token.payload';

@Injectable()
export class JwtService {
	constructor(
		private readonly jwt: Jwt,
		@Inject(jwtConfiguration.KEY)
		private config: ConfigType<typeof jwtConfiguration>,
	) {}

	generateAccessToken(payload: TokenPayload) {
		return this.jwt.sign(payload, {
			secret: this.config.access.secretKey,
			expiresIn: `${this.config.access.expirationTime}s`,
		});
	}

	generateRefreshToken(payload: TokenPayload) {
		return this.jwt.sign(payload, {
			secret: this.config.refresh.secretKey,
			expiresIn: `${this.config.refresh.expirationTime}s`,
		});
	}
}
