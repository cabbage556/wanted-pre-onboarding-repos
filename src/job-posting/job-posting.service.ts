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

  async getDetailPage(id: number): Promise<JobPosting> {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            jobPostings: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    return jobPosting;
  }

  getJobPostingById(id: number): Promise<JobPosting> {
    return this.prismaService.jobPosting.findUnique({ where: { id } });
  }

  async updateJobPosting(
    id: number,
    dto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    const jobPosting = await this.getJobPostingById(id);
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
    const jobPosting = await this.getJobPostingById(id);
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    await this.prismaService.jobPosting.delete({
      where: {
        id,
      },
    });
  }
}
