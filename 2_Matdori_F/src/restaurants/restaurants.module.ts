import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entity/restaurant.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurant]), CacheModule],
	controllers: [RestaurantsController],
	providers: [RestaurantsService],
	exports: [RestaurantsService],
})
export class RestaurantsModule {}
