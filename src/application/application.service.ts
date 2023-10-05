import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto';
import { Application } from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  async createApplication(dto: CreateApplicationDto): Promise<Application> {
    const application = await this.prismaService.application.create({
      data: {
        ...dto,
      },
    });
    return application;
  }
}
