import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteJobPostingDto {
  @ApiProperty({
    description: '삭제 성공 여부',
  })
  deleted: boolean;

  @ApiPropertyOptional({
    description: '삭제 실패 메세지(삭제 성공 시 메세지는 없음)',
  })
  message?: string;
}
