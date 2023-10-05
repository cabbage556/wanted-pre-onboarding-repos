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
  ValidationPipe,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './dto';

@Controller('posts')
export class JobPostingController {
  constructor(
    private jobPostingService: JobPostingService, //
  ) {}

  @Post()
  createJobPosting(
    @Body(new ValidationPipe()) dto: CreateJobPostingDto, //
  ) {
    return this.jobPostingService.createJobPosting(dto);
  }

  @Get('list')
  getJobPostings() {
    return `GET /posts/list`;
  }

  @Get()
  searchJobPostings(
    @Query('search') search: string,
    @Query('field') field: string,
  ) {
    return `GET /posts?search=${search}&field=${field}`;
  }

  @Get(':id')
  getDetailPage(
    @Param('id', ParseIntPipe) id: number, //
  ) {
    return `GET /posts/${id} getDetailPage`;
  }

  @Patch(':id')
  updateJobPosting(
    @Param('id', ParseIntPipe) id: number, //
    @Body(new ValidationPipe()) dto: UpdateJobPostingDto, //
  ) {
    return this.jobPostingService.updateJobPosting(id, dto);
  }

  @Delete(':id')
  deleteJobPosting(
    @Param('id', ParseIntPipe) id: number, //
  ) {
    return `DELETE /posts/${id} deleteJobPosting`;
  }
}
