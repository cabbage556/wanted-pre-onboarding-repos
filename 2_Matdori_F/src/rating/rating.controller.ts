import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AtGuard } from 'src/global/guard/access.token.guard';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';
import { RatingService } from './rating.service';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { RatingResponseMessage } from './classes/rating.response.message';

@Controller('rating')
@UseFilters(JwtExceptionFilter, HttpExceptionFilter)
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Post()
	@UseGuards(AtGuard)
	@ResponseMessage(RatingResponseMessage.RATING)
	async createRating(@GetUser() user: User, @Body() createRatingDto: CreateRatingDto) {
		return await this.ratingService.createRating(user, createRatingDto);
	}
}
