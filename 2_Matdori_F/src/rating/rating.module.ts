import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entity/rating.entity';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Rating, Restaurant, User])],
	providers: [RatingService],
	controllers: [RatingController],
})
export class RatingModule {}
