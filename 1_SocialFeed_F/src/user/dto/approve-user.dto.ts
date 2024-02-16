import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class ApproveUserDto extends OmitType(CreateUserDto, ['email'] as const) {
	@IsNumberString({}, { message: '가입승인코드는 정수형 문자열입니다.' })
	@MinLength(6, { message: '가입승인코드는 6자리입니다.' })
	@MaxLength(6, { message: '가입승인코드는 6자리입니다.' })
	@IsNotEmpty({ message: '가입승인코드는 필수 입력 필드입니다.' })
	signupCode: string;
}
