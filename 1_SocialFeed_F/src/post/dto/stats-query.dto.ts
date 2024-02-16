import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsDueDate } from 'src/commons/decorators/due.date.decorator';
import { StasticsType } from 'src/commons/enums/stastics-type.enum';
import { stasticsValueType } from 'src/commons/enums/stastics-value-type.enum';

export class StatsQueryDto {
	@IsOptional()
	@IsString()
	hashtag: string;

	@IsEnum(StasticsType)
	type: StasticsType.DATE | StasticsType.HOUR;

	@IsOptional()
	@IsDateString()
	@IsDueDate({ dueDay: 7 })
	start: string | Date;

	@IsOptional()
	@IsDateString()
	end: string | Date;

	@IsEnum(stasticsValueType)
	value:
		| stasticsValueType.COUNT
		| stasticsValueType.VIEW_COUNT
		| stasticsValueType.LIKE_COUNT
		| stasticsValueType.SHARE_COUNT;
}
