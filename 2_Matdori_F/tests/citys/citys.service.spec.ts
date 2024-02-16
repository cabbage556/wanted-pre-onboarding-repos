import { Test, TestingModule } from '@nestjs/testing';
import { CitysService } from '../../src/citys/citys.service';

describe('CitysService', () => {
	let service: CitysService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CitysService],
		}).compile();

		service = module.get<CitysService>(CitysService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
