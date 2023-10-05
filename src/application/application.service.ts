import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto';
import { Application } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ApplicationService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  async createApplication(dto: CreateApplicationDto): Promise<Application> {
    try {
      const application = await this.prismaService.application.create({
        data: {
          ...dto,
        },
      });
      return application;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('이미 지원하였음');
      }
    }
  }
}
