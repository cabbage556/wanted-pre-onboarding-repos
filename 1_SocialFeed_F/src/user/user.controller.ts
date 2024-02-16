import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { LoginDto } from './dto/login.dto';
import { AtGuard } from 'src/commons/guards/access.token.guard';
import { GetUser } from 'src/commons/decorators/get.user.decorator';
import { User } from './entities/user.entity';
import { RtGuard } from 'src/commons/guards/refresh.token.guard';
import { ResponseMessage } from 'src/commons/decorators/response.key.decorator';
import { UserResponseMessage } from 'src/commons/class/user.response.message';
import { HttpExceptionFilter } from 'src/commons/filter/http-exception.filter';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ResponseMessage(UserResponseMessage.SIGN_UP)
	async signUp(@Body() createUserDto: CreateUserDto) {
		return await this.userService.createUser(createUserDto);
	}

	@Post('approve')
	@ResponseMessage(UserResponseMessage.APPROVE)
	async approveUser(@Body() approveUserDto: ApproveUserDto) {
		return await this.userService.approveUser(approveUserDto);
	}

	@Post('login')
	@ResponseMessage(UserResponseMessage.SIGN_IN)
	async signIn(@Body() loginDto: LoginDto) {
		return await this.userService.login(loginDto);
	}

	@Post('logout')
	@UseGuards(AtGuard)
	@ResponseMessage(UserResponseMessage.LOG_OUT)
	async logout(@GetUser() user: User) {
		return await this.userService.logout(user);
	}

	@Post('refresh')
	@UseGuards(RtGuard)
	@ResponseMessage(UserResponseMessage.REFRESH)
	async refresh(@GetUser() user: User) {
		return await this.userService.refresh(user);
	}
}
