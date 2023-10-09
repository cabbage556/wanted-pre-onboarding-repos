import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, PageDto } from './dto';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JobPostingWithCompany } from './infer-types';

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

  it('should be defined', () => {
    expect(jobPostingController).toBeDefined();
  });

  it('should be defined', () => {
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
          new PageDto<JobPostingWithCompany>(
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
                company: {
                  id: 1,
                  name: '원티드',
                  nationality: '대한민국',
                  region: '서울',
                },
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
                company: {
                  id: 1,
                  name: '원티드',
                  nationality: '대한민국',
                  region: '서울',
                },
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
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
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
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
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

  describe('searchJobPostings', () => {
    it(`회사 이름에서 '원티드'를 검색해 해당하는 채용공고를 리턴해야 함`, async () => {
      const dto = {
        search: '원티드',
        field: 'company',
      };

      jest //
        .spyOn(jobPostingService, 'searchJobPostings')
        .mockResolvedValueOnce([
          {
            id: 1,
            createdAt: new Date(2023, 9, 9, 12, 54, 30, 333),
            updatedAt: new Date(2023, 9, 9, 12, 54, 30, 333),
            content: '채용 중입니다 1',
            position: 'NestJS 백엔드 개발자',
            stack: '#NestJS #Node.js',
            rewards: 100000,
            companyId: 1,
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
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
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
          },
          {
            id: 3,
            createdAt: new Date(2023, 9, 7, 15, 50, 30, 333),
            updatedAt: new Date(2023, 9, 7, 15, 50, 30, 333),
            content: '채용 중입니다 3',
            position: 'Node.js 백엔드 개발자',
            stack: '#Node.js',
            rewards: 300000,
            companyId: 1,
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
          },
        ]);

      expect(
        jobPostingController.searchJobPostings(dto), //
      ).resolves.toEqual([
        {
          id: 1,
          createdAt: new Date(2023, 9, 9, 12, 54, 30, 333),
          updatedAt: new Date(2023, 9, 9, 12, 54, 30, 333),
          content: '채용 중입니다 1',
          position: 'NestJS 백엔드 개발자',
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId: 1,
          company: {
            id: 1,
            name: '원티드',
            nationality: '대한민국',
            region: '서울',
          },
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
          company: {
            id: 1,
            name: '원티드',
            nationality: '대한민국',
            region: '서울',
          },
        },
        {
          id: 3,
          createdAt: new Date(2023, 9, 7, 15, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 15, 50, 30, 333),
          content: '채용 중입니다 3',
          position: 'Node.js 백엔드 개발자',
          stack: '#Node.js',
          rewards: 300000,
          companyId: 1,
          company: {
            id: 1,
            name: '원티드',
            nationality: '대한민국',
            region: '서울',
          },
        },
      ]);
    });

    it(`포지션에서 'Nest'를 검색해 해당하는 채용공고를 리턴해야 함`, async () => {
      const dto = {
        search: 'Nest',
        field: 'position',
      };

      jest //
        .spyOn(jobPostingService, 'searchJobPostings')
        .mockResolvedValueOnce([
          {
            id: 1,
            createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
            updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
            content: '채용 중입니다 1',
            position: 'NestJS 백엔드 개발자',
            stack: '#NestJS #Node.js',
            rewards: 100000,
            companyId: 1,
            company: {
              id: 1,
              name: '원티드',
              nationality: '대한민국',
              region: '서울',
            },
          },
        ]);

      const jobPostings = await jobPostingController.searchJobPostings(dto);

      expect(
        jobPostings[0].position, //
      ).toMatch(dto.search);

      expect(
        jobPostings, //
      ).toEqual([
        {
          id: 1,
          createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
          content: '채용 중입니다 1',
          position: 'NestJS 백엔드 개발자',
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId: 1,
          company: {
            id: 1,
            name: '원티드',
            nationality: '대한민국',
            region: '서울',
          },
        },
      ]);
    });
  });

  describe('getDetailPage', () => {
    it('채용공고를 리턴해야 함', () => {
      const id = 1;

      jest //
        .spyOn(jobPostingService, 'getDetailPage')
        .mockResolvedValueOnce({
          id: 1,
          createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
          content: '채용 중입니다 1',
          position: 'NestJS 백엔드 개발자',
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId: 1,
          company: {
            id: 1,
            name: '원티드랩',
            nationality: '대한민국',
            region: '서울',
            jobPostings: [
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 3,
              },
            ],
          },
        });

      expect(
        jobPostingController.getDetailPage(id), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
        updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
        content: '채용 중입니다 1',
        position: 'NestJS 백엔드 개발자',
        stack: '#NestJS #Node.js',
        rewards: 100000,
        companyId: 1,
        company: {
          id: 1,
          name: '원티드랩',
          nationality: '대한민국',
          region: '서울',
          jobPostings: [
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
          ],
        },
      });
    });

    it('ForbiddenException 예외를 던져야 함', () => {
      const id = 100;

      jest
        .spyOn(jobPostingService, 'getDetailPage')
        .mockRejectedValueOnce(new ForbiddenException('리소스 접근 거부'));

      expect(
        jobPostingController.getDetailPage(id), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('updateJobPosting', () => {
    it('업데이트된 채용공고를 리턴해야 함', () => {
      const id = 1;
      const dto = {
        content: '원티드랩에서 NestJS 백엔드 개발자를 채용 중입니다.',
        position: '[신입] NestJS 백엔드 개발자',
      };

      jest //
        .spyOn(jobPostingService, 'updateJobPosting')
        .mockResolvedValueOnce({
          id: 1,
          createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
          updatedAt: new Date(2023, 9, 9, 13, 50, 30, 333),
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId: 1,
          ...dto,
        });

      expect(
        jobPostingController.updateJobPosting(id, dto), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
        updatedAt: new Date(2023, 9, 9, 13, 50, 30, 333),
        content: '원티드랩에서 NestJS 백엔드 개발자를 채용 중입니다.',
        position: '[신입] NestJS 백엔드 개발자',
        stack: '#NestJS #Node.js',
        rewards: 100000,
        companyId: 1,
      });
    });

    it('ForbiddenException 예외를 던져야 함', () => {
      const id = 100;
      const dto = {
        rewards: 100000,
      };

      jest
        .spyOn(jobPostingService, 'updateJobPosting')
        .mockRejectedValueOnce(new ForbiddenException('리소스 접근 거부'));

      expect(
        jobPostingController.updateJobPosting(id, dto), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('deleteJobPosting', () => {
    const id = 1;
    it('{ deleted: true }를 리턴해야 함', () => {
      jest
        .spyOn(jobPostingService, 'deleteJobPosting')
        .mockResolvedValueOnce({ deleted: true });

      expect(
        jobPostingController.deleteJobPosting(id), //
      ).resolves.toEqual({ deleted: true });
    });

    it(`{ deleted: false, message: '삭제 실패'}를 리턴해야 함`, () => {
      jest
        .spyOn(jobPostingService, 'deleteJobPosting')
        .mockResolvedValueOnce({ deleted: false, message: '삭제 실패' });

      expect(
        jobPostingController.deleteJobPosting(id), //
      ).resolves.toEqual({ deleted: false, message: '삭제 실패' });
    });

    it('ForbiddenException 예외를 던져야 함', () => {
      const id = 100;

      jest
        .spyOn(jobPostingService, 'deleteJobPosting')
        .mockRejectedValueOnce(new ForbiddenException('리소스 접근 거부'));

      expect(
        jobPostingController.deleteJobPosting(id), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });
});
