import { IsNotEmpty, IsString, IsIn, Length } from 'class-validator';

export class SearchJobPostingsDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100) // 1글자부터 position 필드 최대 길이 100글자까지
  search: string;

  @IsIn(['position', 'company'])
  field: string;
}
