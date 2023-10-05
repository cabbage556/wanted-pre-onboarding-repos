import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class SearchJobPostingsDto {
  @IsNotEmpty()
  @IsString()
  search: string;

  @IsIn(['position', 'company'])
  field: string;
}
