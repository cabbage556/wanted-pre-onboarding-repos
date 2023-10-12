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
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  JobPostingWithCompany,
  JobPostingWithCompanyAndJobPostingsId,
} from './output-types';
import {
  JobPostingEntity,
  JobPostingWithCompanyAndJobPostingsIdEntity,
  JobPostingWithCompanyEntity,
} from './entities';
import { DeleteJobPostingDto } from './dto/delete-job-posting.dto';
import { ApiPaginatedResponse } from 'src/swagger/api-response/api-paginated-response';

@ApiTags('posts')
@ApiExtraModels(PageDto)
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

  @ApiOperation({
    summary: '채용공고 목록 조회(페이지네이션)',
    description:
      '채용공고 목록을 조회하고, 채용공고 목록(data)과 페이지네이션 메타데이터(meta)를 리턴한다.',
  })
  @ApiPaginatedResponse(
    JobPostingWithCompanyEntity,
    '채용공고 목록(data) 및 페이지네이션 메타데이터(meta)',
  )
  @ApiBadRequestResponse({
    description: '요청 쿼리 파라미터 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '리소스 접근 거부'(요청 페이지가 마지막 페이지보다 큰 경우)`,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @Get('list')
  getJobPostings(
    @Query() dto: GetJobPostingsDto, //
  ): Promise<PageDto<JobPostingWithCompany>> {
    return this.jobPostingService.getJobPostings(dto);
  }

  @ApiOperation({
    summary: '채용공고 검색',
    description:
      '채용공고를 검색해 리턴한다. 회사 이름(field=company) 또는 채용포지션(field=position)에서 검색한다.',
  })
  @ApiOkResponse({
    description: '채용공고 검색 결과',
    type: [JobPostingWithCompanyEntity],
  })
  @ApiBadRequestResponse({
    description: '요청 쿼리 파라미터 유효성 검사 실패',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @Get()
  searchJobPostings(
    @Query() dto: SearchJobPostingsDto, //
  ): Promise<JobPostingWithCompany[]> {
    return this.jobPostingService.searchJobPostings(dto);
  }

  @ApiOperation({
    summary: '채용공고 상세 페이지 조회',
    description:
      '채용공고를 조회해 리턴한다. 채용공고를 올린 회사의 채용공고id들을 함께 리턴한다.',
  })
  @ApiOkResponse({
    description: '채용공고 상세 페이지 조회 결과',
    type: JobPostingWithCompanyAndJobPostingsIdEntity,
  })
  @ApiBadRequestResponse({
    description: '요청 패스 파라미터 id 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '리소스 접근 거부'(id에 해당하는 채용공고가 없는 경우)`,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @ApiParam({
    name: 'id',
    description: '채용공고id, 1 이상, 정수값',
    example: 1,
  })
  @Get(':id')
  getDetailPage(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<JobPostingWithCompanyAndJobPostingsId> {
    return this.jobPostingService.getDetailPage(id);
  }

  @ApiOperation({
    summary: '채용공고 수정',
    description: '채용공고를 수정하고 수정한 채용공고를 반환한다.',
  })
  @ApiOkResponse({
    description: '채용공고를 성공적으로 수정하였음',
    type: JobPostingEntity,
  })
  @ApiBadRequestResponse({
    description: '요청 패스 파라미터 id 또는 요청 바디 값 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '리소스 접근 거부'(id에 해당하는 채용공고가 없는 경우)`,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @ApiParam({
    name: 'id',
    description: '채용공고id, 1 이상, 정수값',
    example: 1,
  })
  @Patch(':id')
  updateJobPosting(
    @Param('id', IdValidationPipe) id: number, //
    @Body() dto: UpdateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.updateJobPosting(id, dto);
  }

  @ApiOperation({
    summary: '채용공고 삭제',
    description: '채용공고를 삭제하고 삭제 성공 여부를 반환한다.',
  })
  @ApiOkResponse({
    description: '채용공고 삭제 성공 여부',
    type: DeleteJobPostingDto,
  })
  @ApiBadRequestResponse({
    description: '요청 패스 파라미터 id 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '리소스 접근 거부'(id에 해당하는 채용공고가 없는 경우)`,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러',
  })
  @ApiParam({
    name: 'id',
    description: '채용공고id, 1 이상, 정수값',
    example: 1,
  })
  @Delete(':id')
  deleteJobPosting(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<DeleteJobPostingDto> {
    return this.jobPostingService.deleteJobPosting(id);
  }
}
