import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto';
import { Application } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationEntity } from './entities';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService, //
  ) {}

  @ApiOperation({
    summary: '채용공고 지원',
    description:
      '사용자가 채용공고에 지원합니다. 사용자가 채용공고에 지원하면 지원내역을 생성해 응답합니다. 사용자는 하나의 채용공고에 한 번만 지원할 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '지원내역 생성 결과',
    type: ApplicationEntity,
  })
  @ApiBadRequestResponse({
    description: '요청 바디 값 유효성 검사 실패',
  })
  @ApiForbiddenResponse({
    description: `에러 메세지: '이미 지원하였음'(이미 지원한 경우) 또는 에러 메세지: '리소스 접근 거부'(userId에 해당하는 사용자가 없거나 jobPostingId에 해당하는 채용공고가 없는 경우)`,
  })
  @Post()
  createApplication(
    @Body() dto: CreateApplicationDto, //
  ): Promise<Application> {
    return this.applicationService.createApplication(dto);
  }
}
