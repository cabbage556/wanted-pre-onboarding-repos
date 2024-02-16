import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetPost = createParamDecorator((data, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.post;
});
