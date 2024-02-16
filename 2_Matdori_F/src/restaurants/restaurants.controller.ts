import { Controller, Get, Param, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entity/restaurant.entity';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { CustomParseUUIDPipe } from './pipes/custom-parse-uuid.pipe';
import { GetPostsDto } from './dto/get-posts.dto';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { RestaurantResponse } from './enums/restaurant-response.enum';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';
import { CacheTTL } from '@nestjs/cache-manager';
import { RESTAURANTS_FIND_ONE_TTL } from './constants/restaurants-cache.constants';
import { RestaurantsCacheInterceptor } from './interceptors/restaurants-cache.interceptor';
import { AtGuard } from 'src/global/guard/access.token.guard';

@Controller('restaurants')
@UseFilters(HttpExceptionFilter, JwtExceptionFilter)
@UseGuards(AtGuard)
export class RestaurantsController {
	constructor(private readonly restaurantsService: RestaurantsService) {}

	@Get()
	@ResponseMessage(RestaurantResponse.GET_POSTS)
	getPosts(@Query() getPostsDto: GetPostsDto) {
		return this.restaurantsService.getPosts(getPostsDto);
	}

	@Get(':id')
	@UseInterceptors(RestaurantsCacheInterceptor)
	@CacheTTL(RESTAURANTS_FIND_ONE_TTL)
	@ResponseMessage(RestaurantResponse.FIND_ONE)
	findOne(@Param('id', CustomParseUUIDPipe) id: string): Promise<Restaurant> {
		return this.restaurantsService.findOne(id);
	}
}
