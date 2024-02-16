import { Module } from '@nestjs/common';
import { ScheduleModule as Schedule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenApiRaws } from 'src/global/entities/open-api-raws.entity';
import { Restaurant } from 'src/restaurants/entity/restaurant.entity';

@Module({
	imports: [Schedule.forRoot(), HttpModule, TypeOrmModule.forFeature([OpenApiRaws, Restaurant])],
	providers: [ScheduleService],
})
export class ScheduleModule {}
