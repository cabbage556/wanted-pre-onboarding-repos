import { ExceptionObjError } from '../../global/enums/exception-obj-error.enum';
import { ExceptionObj } from '../../global/interfaces/exception.obj';

export class UsersException {
	static USER_ACCOUNT_ALREADY_EXISTS: ExceptionObj = {
		message: '이미 회원가입 되어있는 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};

	static USER_NOT_EXISTS: ExceptionObj = {
		message: '존재하지 않는 계정입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};

	static USER_PASSWORD_NOT_MATCHED: ExceptionObj = {
		message: '패스워드가 일치하지 않습니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};

	static LOCATION_IS_EMPTY: ExceptionObj = {
		message: '위도와 경도값을 확인해주세요.',
		error: ExceptionObjError.BAD_REQUEST,
	};

	static LOCAION_IS_NULL: ExceptionObj = {
		message: '위치 정보를 먼저 업데이트 해야합니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}
