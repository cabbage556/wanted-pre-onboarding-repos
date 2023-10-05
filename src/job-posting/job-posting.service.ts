import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './dto';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { JobPosting } from '@prisma/client';

@Injectable()
export class JobPostingService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  async createJobPosting(dto: CreateJobPostingDto) {
    try {
      const jobPosting = await this.prismaService.jobPosting.create({
        data: {
          ...dto,
        },
      });
      return jobPosting;
    } catch (error) {
      if (error instanceof PrismaClientInitializationError)
        throw new InternalServerErrorException();
    }
  }

  getJobPostings() {}

  searchJobPostings() {}

  getDetailPage() {}

  async updateJobPosting(
    id: number,
    dto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: {
        id,
      },
    });
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    return this.prismaService.jobPosting.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteJobPosting(id: number): Promise<void> {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: {
        id,
      },
    });
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    await this.prismaService.jobPosting.delete({
      where: {
        id,
      },
    });
  }
}
