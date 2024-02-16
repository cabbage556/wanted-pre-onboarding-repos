import { IsNotEmpty, IsString, IsUUID, IsOptional, Length, Min, Max, IsInt } from 'class-validator';

export class CreateRatingDto {
	@IsUUID(4, { message: 'UUID 형식이 아닙니다.' }) //uuid version default: 4
	@IsNotEmpty({ message: '맛집 ID는 필수 입력 필드입니다.' })
	restaurant_id: string;

	@IsInt({ message: '정수만 입력할 수 있습니다.' })
	@IsNotEmpty({ message: '평점은 필수 입력 필드입니다.' })
	@Min(0, { message: '0~5까지 정수만 사용할 수 있습니다.' })
	@Max(5, { message: '0~5까지 정수만 사용할 수 있습니다.' })
	rating: number;

	@Length(0, 255, { message: 'content는 255자 이하로 입력해야 합니다.' })
	@IsString()
	@IsOptional()
	content: string;
}
