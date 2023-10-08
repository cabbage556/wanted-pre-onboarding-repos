import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto } from './dto';
import { InternalServerErrorException } from '@nestjs/common';

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
            searchInCompany: jest.fn(),
            searchInPostion: jest.fn(),
            searchJobPostings: jest.fn(),
            getDetailPage: jest.fn(),
            getJobPostingById: jest.fn(),
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

  describe('createJobPosting', () => {
    const dto: CreateJobPostingDto = {
      content: '원티드랩에서 NestJS 백엔드 개발자를 채용 중입니다......',
      position: 'NestJS 백엔드 개발자',
      stack: '#NestJS #Node.js',
      rewards: 500000,
      companyId: 1,
    };

    it('생성한 채용공고 레코드를 리턴해야 함', () => {
      jest
        .spyOn(jobPostingService, 'createJobPosting')
        .mockImplementationOnce((dto) =>
          Promise.resolve({
            id: 1,
            createdAt: new Date(2023, 9, 8, 23, 5, 30, 333),
            updatedAt: new Date(2023, 9, 8, 23, 5, 30, 333),
            ...dto,
            stack: dto.stack,
            rewards: dto.rewards,
          }),
        );

      expect(
        jobPostingController.createJobPosting(dto), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 8, 23, 5, 30, 333),
        updatedAt: new Date(2023, 9, 8, 23, 5, 30, 333),
        ...dto,
      });
    });

    it('DB 연결에 문제가 있으면 InternalServerErrorException 예외를 던져야 함', () => {
      jest
        .spyOn(jobPostingService, 'createJobPosting')
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(
        jobPostingController.createJobPosting(dto), //
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });
});
