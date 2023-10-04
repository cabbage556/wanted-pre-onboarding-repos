import { Module } from '@nestjs/common';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
