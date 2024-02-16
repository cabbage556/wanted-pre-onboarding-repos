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
  DeleteJobPostingDto,
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
import { ApiPaginatedResponse } from '../swagger/api-response/api-paginated-response';

@ApiTags('posts')
@ApiExtraModels(PageDto)
@Controller('posts')
export class JobPostingController {
  constructor(
    private jobPostingService: JobPostingService, //
  ) {}

  @ApiOperation({
    summary: '채용공고 등록',
    description: '채용공고를 생성하고 생성한 채용공고 정보를 응답합니다.',
  })
  @ApiCreatedResponse({
    description: '채용공고 생성 결과',
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
      '채용공고 목록을 조회하고, 채용공고 목록(data)과 페이지네이션 메타데이터(meta)를 응답합니다.',
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
      '채용공고를 검색해 응답합니다. 검색 필드에는 회사 이름(company)과 채용포지션(position)이 존재합니다. 회사 이름을 검색하려면 field 쿼리 파라미터에 company를 전달합니다. 채용포지션을 검색하려면 field 쿼리 파라미터에 position을 전달합니다.',
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
      '단일 채용공고를 조회해 응답합니다. 해당 채용공고를 올린 회사의 채용공고가 더 있다면 채용공고의 id들을 함께 응답합니다.',
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
    description: '채용공고를 수정하고 수정한 채용공고 정보를 응답합니다.',
  })
  @ApiOkResponse({
    description: '채용공고 수정 결과',
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
    description:
      '채용공고를 삭제하고 삭제 성공 여부를 응답합니다. 채용공고 삭제 시 채용공고에 지원한 지역내역도 모두 삭제됩니다.',
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
