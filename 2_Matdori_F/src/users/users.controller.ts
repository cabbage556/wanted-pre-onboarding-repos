import { Controller, Post, Get, UseFilters, Body, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { UserResponseMessage } from 'src/users/classes/user.response.message';
import { LoginUserDto } from './dto/login-user.dto';
import { AtGuard } from 'src/global/guard/access.token.guard';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { User } from './entity/user.entity';
import { RtGuard } from 'src/global/guard/refresh.token.guard';
import { LocationDto } from './dto/location-user.dto';
import { LunchRecommendDto } from './dto/lunch-recommend.dto';

@Controller('users')
@UseFilters(HttpExceptionFilter, JwtExceptionFilter)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ResponseMessage(UserResponseMessage.SIGN_UP)
	async signUp(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.createUser(createUserDto);
	}

	@Post('login')
	@ResponseMessage(UserResponseMessage.SIGN_IN)
	async singIn(@Body() loginUserDto: LoginUserDto) {
		return await this.usersService.loginUser(loginUserDto);
	}

	@Post('logout')
	@UseGuards(AtGuard)
	@ResponseMessage(UserResponseMessage.LOG_OUT)
	async singOut(@GetUser() user: User) {
		return await this.usersService.logoutUser(user);
	}

	@Post('refresh')
	@UseGuards(RtGuard)
	@ResponseMessage(UserResponseMessage.REFRESH)
	async refresh(@GetUser() user: User) {
		return await this.usersService.refresh(user);
	}

	@Patch('geo')
	@UseGuards(AtGuard)
	@ResponseMessage(UserResponseMessage.LOCATION)
	async updateLocation(@GetUser() user: User, @Body() locationDto: LocationDto) {
		return await this.usersService.updateLocation(user, locationDto);
	}

	@Patch('lunch')
	@UseGuards(AtGuard)
	@ResponseMessage(UserResponseMessage.LUNCH_RECOMM)
	async updateLunchRecomm(@GetUser() user: User, @Body() lunchRecommendDto: LunchRecommendDto) {
		return await this.usersService.updateLunchRecomm(user, lunchRecommendDto);
	}

	@Get()
	@UseGuards(AtGuard)
	@ResponseMessage(UserResponseMessage.GET_USER)
	async getUser(@GetUser() user: User) {
		return user;
	}
}
