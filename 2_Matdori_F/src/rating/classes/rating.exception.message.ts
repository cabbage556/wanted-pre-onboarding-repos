import { ExceptionObjError } from 'src/global/enums/exception-obj-error.enum';
import { ExceptionObj } from 'src/global/interfaces/exception.obj';

export class RatingException {
	static RATING_NOT_EXISTS: ExceptionObj = {
		message: '존재하지 않는 맛집입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}
