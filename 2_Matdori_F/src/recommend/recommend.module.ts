import { Module } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { UsersModule } from 'src/users/users.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurant]), UsersModule, RestaurantsModule],
	providers: [RecommendService],
})
export class RecommendModule {}
