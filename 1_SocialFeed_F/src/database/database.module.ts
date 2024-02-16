import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.getOrThrow('MYSQL_HOST'),
				port: configService.getOrThrow('MYSQL_PORT'),
				username: configService.getOrThrow('MYSQL_ROOT_USER'),
				password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
				database: configService.getOrThrow('MYSQL_DATABASE'),
				entities: [__dirname + '/../**/*.entity.*'],
				synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
				logging: configService.getOrThrow('MYSQL_LOGGING'),
			}),
		}),
	],
})
export class DatabaseModule {}
