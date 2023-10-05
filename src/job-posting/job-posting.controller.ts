import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './dto';
import { JobPosting } from '@prisma/client';

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
    @Query('page', ParseIntPipe) page = 1, //
  ): Promise<JobPosting[]> {
    return this.jobPostingService.getJobPostings(page);
  }

  @Get()
  searchJobPostings(
    @Query('search') search: string,
    @Query('field') field: string,
  ): Promise<JobPosting[]> {
    return this.jobPostingService.searchJobPostings(search, field);
  }

  @Get(':id')
  getDetailPage(
    @Param('id', ParseIntPipe) id: number, //
  ): Promise<JobPosting> {
    return this.jobPostingService.getDetailPage(id);
  }

  @Patch(':id')
  updateJobPosting(
    @Param('id', ParseIntPipe) id: number, //
    @Body() dto: UpdateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.updateJobPosting(id, dto);
  }

  @Delete(':id')
  deleteJobPosting(
    @Param('id', ParseIntPipe) id: number, //
  ): Promise<void> {
    return this.jobPostingService.deleteJobPosting(id);
  }
}
