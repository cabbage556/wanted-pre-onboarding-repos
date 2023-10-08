import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import {
  CreateJobPostingDto,
  GetJobPostingsDto,
  PageDto,
  SearchJobPostingsDto,
  UpdateJobPostingDto,
} from './dto';
import { JobPosting } from '@prisma/client';
import { IdValidationPipe } from '../pipes';

@Controller('posts')
export class JobPostingController {
  constructor(
    private jobPostingService: JobPostingService, //
  ) {}

  @Post()
  createJobPosting(
    @Body() dto: CreateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.createJobPosting(dto);
  }

  @Get('list')
  getJobPostings(
    @Query() dto: GetJobPostingsDto, //
  ): Promise<PageDto<JobPosting>> {
    return this.jobPostingService.getJobPostings(dto);
  }

  @Get()
  searchJobPostings(
    @Query() dto: SearchJobPostingsDto, //
  ): Promise<JobPosting[]> {
    return this.jobPostingService.searchJobPostings(dto);
  }

  @Get(':id')
  getDetailPage(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<JobPosting> {
    return this.jobPostingService.getDetailPage(id);
  }

  @Patch(':id')
  updateJobPosting(
    @Param('id', IdValidationPipe) id: number, //
    @Body() dto: UpdateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.updateJobPosting(id, dto);
  }

  @Delete(':id')
  deleteJobPosting(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<{ deleted: boolean; message?: string }> {
    return this.jobPostingService.deleteJobPosting(id);
  }
}
