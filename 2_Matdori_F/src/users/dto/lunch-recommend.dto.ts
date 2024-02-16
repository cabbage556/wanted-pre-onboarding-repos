import { IsIn, IsNotEmpty } from 'class-validator';

export class LunchRecommendDto {
	@IsIn([0, 1], { message: 'lunchRecomm 필드는 0 또는 1이어야 합니다.' })
	@IsNotEmpty({ message: 'lunchRecomm 필드는 필수 입력 필드입니다.' })
	lunchRecomm: number;
}
