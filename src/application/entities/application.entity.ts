import { ApiProperty } from '@nestjs/swagger';
import { Application } from '@prisma/client';

export class ApplicationEntity implements Application {
  @ApiProperty({
    minimum: 1,
    example: 1,
  })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    minimum: 1,
    example: 1,
  })
  jobPostingId: number;

  @ApiProperty({
    minimum: 1,
    example: 1,
  })
  userId: number;
}
