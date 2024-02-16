import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
	imports: [Jwt.register({})],
	providers: [JwtService],
	exports: [JwtService],
})
export class JwtModule {}
