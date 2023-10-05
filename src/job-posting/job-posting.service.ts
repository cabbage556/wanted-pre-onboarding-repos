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

  async getJobPostings(page: number): Promise<JobPosting[]> {
    const take = 10;
    const jobPostings = await this.prismaService.jobPosting.findMany({
      take,
      skip: (page - 1) * take,
    });
    return jobPostings;
  }

  searchInCompany(search: string): Promise<JobPosting[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        company: {
          name: {
            search,
          },
        },
      },
    });
  }

  searchInPosition(search: string): Promise<JobPosting[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        position: {
          search,
        },
      },
    });
  }

  async searchJobPostings(
    search: string,
    field: string,
  ): Promise<JobPosting[]> {
    let jobPostings = [];
    if (field === 'company') jobPostings = await this.searchInCompany(search);
    else if (field === 'position')
      jobPostings = await this.searchInPosition(search);

    return jobPostings;
  }

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
