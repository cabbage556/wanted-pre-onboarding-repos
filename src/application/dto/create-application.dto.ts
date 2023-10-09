import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  jobPostingId: number;
}
