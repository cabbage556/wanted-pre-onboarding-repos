import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { JobPostingModule } from './job-posting/job-posting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //
    PrismaModule,
    JobPostingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
