import { Module } from '@nestjs/common';
import { CitysService } from './citys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { CitysController } from './citys.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
	imports: [TypeOrmModule.forFeature([City]), CacheModule],
	controllers: [CitysController],
	providers: [CitysService],
})
export class CitysModule {}
