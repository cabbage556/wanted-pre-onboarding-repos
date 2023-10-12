import { PickType } from '@nestjs/swagger';
import { JobPostingEntity } from './job-posting.entity';

export class JobPostingWithIdOnlyEntity extends PickType(JobPostingEntity, [
  'id',
] as const) {}
