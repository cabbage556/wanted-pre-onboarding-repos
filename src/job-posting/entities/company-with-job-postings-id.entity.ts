import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from './company.entity';
import { JobPostingWithIdOnlyEntity } from './job-posting-with-id-only.entity';

export class CompanyWithJobPostingsIdEntity extends CompanyEntity {
  @ApiProperty({
    description: '채용공고id 객체 배열',
    type: [JobPostingWithIdOnlyEntity],
  })
  jobPostings: JobPostingWithIdOnlyEntity[];
}
