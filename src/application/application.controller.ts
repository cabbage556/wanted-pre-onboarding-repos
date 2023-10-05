import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto';
import { Application } from '@prisma/client';

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService, //
  ) {}

  @Post()
  createApplication(
    @Body() dto: CreateApplicationDto, //
  ): Promise<Application> {
    console.log(dto);
    return this.applicationService.createApplication(dto);
  }
}
