import { Body, Controller, Get, Post, UseGuards, Query, UseFilters, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AtGuard } from 'src/commons/guards/access.token.guard';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/commons/decorators/get.user.decorator';
import { ResponseMessage } from 'src/commons/decorators/response.key.decorator';
import { PostResponseMessage } from 'src/commons/class/post.response.message';
import { PostGuard } from 'src/commons/guards/post.guard';
import { GetPost } from 'src/commons/decorators/get.post.decorator';
import { Post as PostType } from './entities/post.entity';
import { PostsQueryDto } from './dto/query-post.dto';
import { HttpExceptionFilter } from 'src/commons/filter/http-exception.filter';
import { StatsQueryDto } from './dto/stats-query.dto';

@Controller('posts')
@UseFilters(HttpExceptionFilter)
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	@UseGuards(AtGuard)
	@ResponseMessage(PostResponseMessage.CREATE_POST)
	async createPost(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
		return await this.postService.createPost(user, createPostDto);
	}

	@Get('/stastics')
	@UseGuards(AtGuard)
	@ResponseMessage(PostResponseMessage.STASTICS)
	async getStats(@Query() statsQueryDto: StatsQueryDto, @GetUser() user: User) {
		return await this.postService.getStats(statsQueryDto, user);
	}

	@Get('/:postId')
	@UseGuards(AtGuard, PostGuard)
	@ResponseMessage(PostResponseMessage.GET_POST)
	async getPost(@GetPost() post: PostType) {
		return await this.postService.getPost(post);
	}

	@Patch('like/:postId')
	@UseGuards(AtGuard, PostGuard)
	@ResponseMessage(PostResponseMessage.LIKE)
	async like(@GetPost() post: PostType) {
		return await this.postService.like(post);
	}

	@Patch('share/:postId')
	@UseGuards(AtGuard, PostGuard)
	@ResponseMessage(PostResponseMessage.SHARE)
	async share(@GetPost() post: PostType) {
		return await this.postService.share(post);
	}

	@Get()
	@UseGuards(AtGuard)
	@ResponseMessage(PostResponseMessage.FIND_POSTS)
	async findPosts(@Query() query: PostsQueryDto, @GetUser() user: User) {
		return this.postService.findPosts(query, user.account);
	}
}
