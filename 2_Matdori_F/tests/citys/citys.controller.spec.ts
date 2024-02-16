import { Test, TestingModule } from '@nestjs/testing';
import { CitysController } from '../../src/citys/citys.controller';
import { CitysService } from '../../src/citys/citys.service';

describe('CitysController', () => {
	let controller: CitysController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CitysController],
			providers: [CitysService],
		}).compile();

		controller = module.get<CitysController>(CitysController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
