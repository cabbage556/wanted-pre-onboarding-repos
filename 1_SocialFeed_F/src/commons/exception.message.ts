import { ExceptionObjError } from './enums/exception-obj-error.enum';

export interface ExceptionObj {
	message: string;
	error: ExceptionObjError;
}

export class UsersException {
	static USER_ACCOUNT_ALREADY_EXISTS: ExceptionObj = {
		message: '이미 회원가입 되어있는 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static USER_NOT_EXISTS: ExceptionObj = {
		message: '존재하지 않는 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static USER_ALREADY_CERTIFIED: ExceptionObj = {
		message: '이미 가입승인된 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static USER_PASSWORD_NOT_MATCHED: ExceptionObj = {
		message: '패스워드가 일치하지 않습니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static USER_SIGNUPCODE_NOT_MATCHED: ExceptionObj = {
		message: '인증코드가 일치하지 않습니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static USER_NOT_CERTIFIED: ExceptionObj = {
		message: '회원 가입 승인이 되지 않은 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}

export class PostsException {
	static POST_NOT_EXISTS: ExceptionObj = {
		message: '게시물이 존재하지 않습니다',
		error: ExceptionObjError.BAD_REQUEST,
	};
}

export class StatsException {
	static STATS_MAX_SEVEN_DAY: ExceptionObj = {
		message: '최대 조회 가능한 날짜는 7일 입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}
