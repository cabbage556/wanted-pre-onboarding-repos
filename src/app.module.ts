import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './global/configs/validation.schema';
import { ScheduleModule } from './schedule/schedule.module';
import jwtConfiguration from './global/configs/jwt.configuration';
import openApiConfiguration from './global/configs/open-api.configuration';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CitysModule } from './citys/citys.module';
import redisConfiguration from './global/configs/redis.configuration';
import { CacheModule } from './cache/cache.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [jwtConfiguration, openApiConfiguration, redisConfiguration],
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema,
		}),
		DatabaseModule,
		ScheduleModule,
		RestaurantsModule,
		UsersModule,
		AuthModule,
		CitysModule,
		CacheModule,
	],
})
export class AppModule {}
