import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { JobPostingModule } from './job-posting/job-posting.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //
    PrismaModule,
    JobPostingModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
