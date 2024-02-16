import { OmitType } from '@nestjs/swagger';
import { ApproveUserDto } from './approve-user.dto';

export class LoginDto extends OmitType(ApproveUserDto, ['signupCode'] as const) {}
