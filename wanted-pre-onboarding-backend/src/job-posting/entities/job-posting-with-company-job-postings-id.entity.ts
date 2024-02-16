import { ApiProperty } from '@nestjs/swagger';
import { JobPostingEntity } from './job-posting.entity';
import { CompanyWithJobPostingsIdEntity } from './company-with-job-postings-id.entity';

export class JobPostingWithCompanyAndJobPostingsIdEntity extends JobPostingEntity {
  @ApiProperty({
    description: '채용공고를 올린 회사 정보와 회사의 채용공고 id들',
  })
  company: CompanyWithJobPostingsIdEntity;
}
