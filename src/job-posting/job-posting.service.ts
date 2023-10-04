import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobPostingService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  createJobPosting() {}

  getJobPostings() {}

  searchJobPostings() {}

  getDetailPage() {}

  updateJobPosting() {}

  deleteJobPosting() {}
}
