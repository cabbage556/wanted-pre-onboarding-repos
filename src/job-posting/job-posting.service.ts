import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateJobPostingDto,
  GetJobPostingsDto,
  PageDto,
  PageMetaDto,
  SearchJobPostingsDto,
  UpdateJobPostingDto,
} from './dto';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { JobPosting } from '@prisma/client';
import {
  JobPostingWithCompany,
  JobPostingWithCompanyAndJobPostingsId,
  includeCompany,
  includeCompanyAndSelectJobPostingsId,
} from './infer-types';

@Injectable()
export class JobPostingService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  async createJobPosting(
    dto: CreateJobPostingDto, //
  ): Promise<JobPosting> {
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

  async getJobPostings({
    page,
    take,
  }: GetJobPostingsDto): Promise<PageDto<JobPostingWithCompany>> {
    const totalCounts = await this.prismaService.jobPosting.count();
    const pageMetaDto = new PageMetaDto({ totalCounts, page, take });
    const jobPostings = await this.prismaService.jobPosting.findMany({
      take: pageMetaDto.take,
      skip: (pageMetaDto.page - 1) * pageMetaDto.take,
      include: includeCompany,
    });

    if (pageMetaDto.lastPage >= pageMetaDto.page) {
      return new PageDto<JobPostingWithCompany>(jobPostings, pageMetaDto);
    } else {
      throw new ForbiddenException('리소스 접근 거부');
    }
  }

  private searchInCompany(
    search: string, //
  ): Promise<JobPostingWithCompany[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        company: {
          name: {
            contains: search,
          },
        },
      },
      include: includeCompany,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  private searchInPosition(
    search: string, //
  ): Promise<JobPostingWithCompany[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        position: {
          contains: search,
        },
      },
      include: includeCompany,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async searchJobPostings({
    search,
    field,
  }: SearchJobPostingsDto): Promise<JobPostingWithCompany[]> {
    let jobPostings = null;
    switch (field) {
      case 'company':
        jobPostings = await this.searchInCompany(search);
        break;
      case 'position':
        jobPostings = await this.searchInPosition(search);
        break;
      default:
        jobPostings = [];
    }

    return jobPostings;
  }

  async getDetailPage(
    id: number, //
  ): Promise<JobPostingWithCompanyAndJobPostingsId> {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id },
      include: includeCompanyAndSelectJobPostingsId,
    });
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    return jobPosting;
  }

  getJobPostingById(
    id: number, //
  ): Promise<JobPosting> {
    return this.prismaService.jobPosting.findUnique({ where: { id } });
  }

  async updateJobPosting(
    id: number, //
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

  async deleteJobPosting(
    id: number, //
  ): Promise<{ deleted: boolean; message?: string }> {
    const jobPosting = await this.getJobPostingById(id);
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    try {
      await this.prismaService.jobPosting.delete({
        where: {
          id,
        },
      });
      return { deleted: true };
    } catch (_) {
      return { deleted: false, message: '삭제 실패' };
    }
  }
}
