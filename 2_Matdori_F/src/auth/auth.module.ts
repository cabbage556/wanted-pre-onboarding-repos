import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
	imports: [Jwt.register({})],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
