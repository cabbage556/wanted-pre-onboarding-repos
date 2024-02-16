import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { PostsException } from '../exception.message';

interface PostRequest extends Request {
	post: Post;
}

@Injectable()
export class PostGuard implements CanActivate {
	constructor(private readonly postService: PostService) {}

	async canActivate(context: ExecutionContext) {
		const request: PostRequest = context.switchToHttp().getRequest();
		const pathSplit = request.path.split('/');
		const postId = pathSplit[pathSplit.length - 1];

		const post = await this.postService.findOne(postId);

		if (!post) throw new BadRequestException(PostsException.POST_NOT_EXISTS);

		request.post = post;
		return true;
	}
}
