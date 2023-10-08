import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';

describe('JobPostingController', () => {
  let jobPostingController: JobPostingController;
  let jobPostingService: JobPostingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostingController],
      providers: [
        {
          provide: JobPostingService,
          useValue: {
            createJobPosting: jest.fn(),
            getJobPostings: jest.fn(),
            searchJobPostings: jest.fn(),
            getDetailPage: jest.fn(),
            updateJobPosting: jest.fn(),
            deleteJobPosting: jest.fn(),
          },
        },
      ],
    }).compile();

    jobPostingController =
      module.get<JobPostingController>(JobPostingController);
    jobPostingService = module.get<JobPostingService>(JobPostingService);
  });

  it('controller should be defined', () => {
    expect(jobPostingController).toBeDefined();
  });

  it('service should be defined', () => {
    expect(jobPostingService).toBeDefined();
  });
});
