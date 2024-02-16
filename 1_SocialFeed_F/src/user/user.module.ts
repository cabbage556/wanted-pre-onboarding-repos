import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { AtStrategy } from 'src/commons/strategy/access.token.strategy';
import { RtStrategy } from 'src/commons/strategy/refresh.token.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([User]), JwtModule],
	controllers: [UserController],
	providers: [UserService, AtStrategy, RtStrategy],
	exports: [UserService],
})
export class UserModule {}
