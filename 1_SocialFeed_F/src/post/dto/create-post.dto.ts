import { IsEnum, IsString } from 'class-validator';
import { SnsProvider } from '../../commons/enums/sns-provider.enum';

export class CreatePostDto {
	@IsString()
	title: string;

	@IsString()
	content: string;

	hashtags: string[];

	@IsEnum(SnsProvider)
	type: SnsProvider;
}
