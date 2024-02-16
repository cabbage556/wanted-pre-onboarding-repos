import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { validationSchema } from './commons/configs/validationSchema';
import jwtConfiguration from './commons/configs/jwt.configuration';
import { JwtModule } from './jwt/jwt.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [jwtConfiguration],
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema,
		}),
		DatabaseModule,
		UserModule,
		PostModule,
		JwtModule,
	],
})
export class AppModule {}
