import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as Cache } from '@nestjs/cache-manager';
import { ConfigModule, ConfigType } from '@nestjs/config';
import redisConfiguration from 'src/global/configs/redis.configuration';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
	imports: [
		Cache.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [redisConfiguration.KEY],
			useFactory: async (config: ConfigType<typeof redisConfiguration>) => ({
				store: await redisStore({ socket: { host: 'redis', port: +config.redis.port } }),
			}),
		}),
	],
	providers: [CacheService],
	exports: [CacheService],
})
export class CacheModule {}
