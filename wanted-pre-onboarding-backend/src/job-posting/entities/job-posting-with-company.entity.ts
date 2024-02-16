import { CompanyEntity } from './company.entity';
import { JobPostingEntity } from './job-posting.entity';
import { ApiProperty } from '@nestjs/swagger';

export class JobPostingWithCompanyEntity extends JobPostingEntity {
  @ApiProperty({
    description: '채용공고를 올린 회사 정보',
  })
  company: CompanyEntity;
}
