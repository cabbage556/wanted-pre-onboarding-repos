import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, PageDto } from './dto';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JobPosting } from '@prisma/client';

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

  describe('getJobPostings', () => {
    it('page: 1, take: 2이면 채용공고 목록 2개와 페이지 메타데이터를 리턴해야 함', () => {
      const dto = {
        page: 1,
        take: 2,
      };

      jest //
        .spyOn(jobPostingService, 'getJobPostings')
        .mockResolvedValueOnce(
          new PageDto<JobPosting>(
            [
              {
                id: 1,
                createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
                updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
                content: '채용 중입니다 1',
                position: 'NestJS 백엔드 개발자',
                stack: '#NestJS #Node.js',
                rewards: 100000,
                companyId: 1,
              },
              {
                id: 2,
                createdAt: new Date(2023, 9, 7, 14, 50, 30, 333),
                updatedAt: new Date(2023, 9, 7, 14, 50, 30, 333),
                content: '채용 중입니다 2',
                position: 'Express 백엔드 개발자',
                stack: '#Express #Node.js',
                rewards: 200000,
                companyId: 1,
              },
            ],
            {
              page: 1,
              take: 2,
              startPage: 1,
              lastPage: 3,
              pageList: [1, 2, 3],
              hasPrevPage: false,
              hasNextPage: true,
            },
          ),
        );

      expect(
        jobPostingController.getJobPostings(dto), //
      ).resolves.toEqual({
        data: [
          {
            id: 1,
            createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
            updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
            content: '채용 중입니다 1',
            position: 'NestJS 백엔드 개발자',
            stack: '#NestJS #Node.js',
            rewards: 100000,
            companyId: 1,
          },
          {
            id: 2,
            createdAt: new Date(2023, 9, 7, 14, 50, 30, 333),
            updatedAt: new Date(2023, 9, 7, 14, 50, 30, 333),
            content: '채용 중입니다 2',
            position: 'Express 백엔드 개발자',
            stack: '#Express #Node.js',
            rewards: 200000,
            companyId: 1,
          },
        ],
        meta: {
          page: 1,
          take: 2,
          startPage: 1,
          lastPage: 3,
          pageList: [1, 2, 3],
          hasPrevPage: false,
          hasNextPage: true,
        },
      });
    });

    it('마지막 페이지보다 전달한 page가 더 크면 ForbiddenException 예외를 던져야 함', () => {
      const dto = {
        page: 5,
        take: 3,
      };

      jest
        .spyOn(jobPostingService, 'getJobPostings')
        .mockRejectedValueOnce(new ForbiddenException('리소스 접근 거부'));

      expect(
        jobPostingController.getJobPostings(dto), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });
});
