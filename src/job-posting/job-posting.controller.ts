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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  JobPostingWithCompany,
  JobPostingWithCompanyAndJobPostingsId,
} from './output-types';
import { JobPostingEntity } from './entities';

@ApiTags('posts')
@Controller('posts')
export class JobPostingController {
  constructor(
    private jobPostingService: JobPostingService, //
  ) {}

  @ApiOperation({
    summary: '채용공고 등록',
    description: '채용공고를 생성하고 생성한 채용공고 정보를 반환한다.',
  })
  @ApiCreatedResponse({
    description: '채용공고를 성공적으로 생성하였음',
    type: JobPostingEntity,
  })
  @ApiBadRequestResponse({
    description: '요청 바디 값 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '리소스 접근 거부'(companyId에 해당하는 회사가 없는 경우)`,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @Post()
  createJobPosting(
    @Body() dto: CreateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.createJobPosting(dto);
  }

  @Get('list')
  getJobPostings(
    @Query() dto: GetJobPostingsDto, //
  ): Promise<PageDto<JobPostingWithCompany>> {
    return this.jobPostingService.getJobPostings(dto);
  }

  @Get()
  searchJobPostings(
    @Query() dto: SearchJobPostingsDto, //
  ): Promise<JobPostingWithCompany[]> {
    return this.jobPostingService.searchJobPostings(dto);
  }

  @Get(':id')
  getDetailPage(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<JobPostingWithCompanyAndJobPostingsId> {
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
