import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingService } from './job-posting.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import {
  JobPostingWithCompany,
  JobPostingWithCompanyAndJobPostingsId,
  includeCompanyAndSelectJobPostingsId,
} from './output-types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const companyArray = [
  {
    id: 1,
    name: '원티드',
    nationality: '대한민국',
    region: '서울',
  },
  {
    id: 2,
    name: '에이스랩',
    nationality: '대한민국',
    region: '서울',
  },
];

const jobPostingArray = [
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
  {
    id: 3,
    createdAt: new Date(2023, 9, 7, 15, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 15, 50, 30, 333),
    content: '채용 중입니다 3',
    position: 'Node.js 백엔드 개발자',
    stack: '#Node.js',
    rewards: 300000,
    companyId: 1,
  },
  {
    id: 4,
    createdAt: new Date(2023, 9, 7, 16, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 16, 50, 30, 333),
    content: '채용 중입니다 4',
    position: 'Spring 백엔드 개발자',
    stack: '#Spring',
    rewards: 400000,
    companyId: 2,
  },
  {
    id: 5,
    createdAt: new Date(2023, 9, 7, 17, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 17, 50, 30, 333),
    content: '채용 중입니다 5',
    position: 'Django 백엔드 개발자',
    stack: '#Django',
    rewards: 500000,
    companyId: 2,
  },
];
const oneJobPosting = jobPostingArray[0];

describe('JobPostingService', () => {
  let service: JobPostingService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPostingService, //
        {
          provide: PrismaService,
          useValue: {
            jobPosting: {
              create: jest.fn(),
              count: jest.fn().mockReturnValue(jobPostingArray.length),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobPostingService>(JobPostingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('createJobPosting', () => {
    const dto = {
      content: '채용 중입니다 1',
      position: 'NestJS 백엔드 개발자',
      stack: '#NestJS #Node.js',
      rewards: 100000,
      companyId: 1,
    };

    it('채용공고 레코드를 생성하고 리턴해야 함', () => {
      jest
        .spyOn(prismaService.jobPosting, 'create')
        .mockResolvedValueOnce(oneJobPosting);

      expect(
        service.createJobPosting(dto), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
        updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
        content: '채용 중입니다 1',
        position: 'NestJS 백엔드 개발자',
        stack: '#NestJS #Node.js',
        rewards: 100000,
        companyId: 1,
      });
    });

    it('companyId가 존재하지 않으면 ForbiddenException 예외를 던져야 함', () => {
      jest
        .spyOn(prismaService.jobPosting, 'create')
        .mockRejectedValueOnce(
          new PrismaClientKnownRequestError(
            'Foreign key constraint failed on the field: {companyId}',
            { code: 'P2003', clientVersion: '5.3.1' },
          ),
        );

      expect(
        service.createJobPosting({
          ...dto,
          companyId: 3,
        }),
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('getJobPostings', () => {
    it('page: 1, take: 2이면 채용공고 목록 2개와 페이지 메타데이터를 리턴해야 함', () => {
      const [page, take] = [1, 2];

      jest //
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce([
          {
            ...jobPostingArray[0],
            company: {
              ...companyArray[0],
            },
          } as JobPostingWithCompany,
          {
            ...jobPostingArray[1],
            company: {
              ...companyArray[0],
            },
          } as JobPostingWithCompany,
        ]);

      expect(
        service.getJobPostings({
          page,
          take,
        }),
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
      const [page, take] = [5, 2];

      expect(
        service.getJobPostings({
          page,
          take,
        }),
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('searchJobPostings', () => {
    it(`Company 테이블의 name 칼럼에서 '원티드'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      const [search, field] = ['원티드', 'company'];

      jest //
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce([
          {
            ...jobPostingArray[0],
            company: {
              ...companyArray[0],
            },
          } as JobPostingWithCompany,
          {
            ...jobPostingArray[1],
            company: {
              ...companyArray[0],
            },
          } as JobPostingWithCompany,
          {
            ...jobPostingArray[2],
            company: {
              ...companyArray[0],
            },
          } as JobPostingWithCompany,
        ]);

      expect(
        service.searchJobPostings({
          search,
          field,
        }),
      ).resolves.toEqual([
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

    it(`Company 테이블의 name 칼럼에서 '에이스'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      const [search, field] = ['에이스', 'company'];

      jest //
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce([
          {
            ...jobPostingArray[3],
            company: {
              ...companyArray[1],
            },
          } as JobPostingWithCompany,
          {
            ...jobPostingArray[4],
            company: {
              ...companyArray[1],
            },
          } as JobPostingWithCompany,
        ]);

      expect(
        service.searchJobPostings({
          search,
          field,
        }),
      ).resolves.toEqual([
        {
          id: 4,
          createdAt: new Date(2023, 9, 7, 16, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 16, 50, 30, 333),
          content: '채용 중입니다 4',
          position: 'Spring 백엔드 개발자',
          stack: '#Spring',
          rewards: 400000,
          companyId: 2,
          company: {
            id: 2,
            name: '에이스랩',
            nationality: '대한민국',
            region: '서울',
          },
        },
        {
          id: 5,
          createdAt: new Date(2023, 9, 7, 17, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 17, 50, 30, 333),
          content: '채용 중입니다 5',
          position: 'Django 백엔드 개발자',
          stack: '#Django',
          rewards: 500000,
          companyId: 2,
          company: {
            id: 2,
            name: '에이스랩',
            nationality: '대한민국',
            region: '서울',
          },
        },
      ]);
    });

    it(`JobPosting 테이블의 position 칼럼에서 'Nest'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      const [search, field] = ['Nest', 'position'];

      jest.spyOn(prismaService.jobPosting, 'findMany').mockResolvedValueOnce([
        {
          ...jobPostingArray[0],
          company: {
            ...companyArray[0],
          },
        } as JobPostingWithCompany,
      ]);

      expect(
        service.searchJobPostings({
          search,
          field,
        }),
      ).resolves.toEqual([
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
    it(`id '1'에 해당하는 채용공고와 해당 회사가 올린 다른 채용공고의 id를 리턴해야 함`, () => {
      const id = 1;

      jest //
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce({
          ...oneJobPosting,
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
        } as JobPostingWithCompanyAndJobPostingsId);

      expect(
        service.getDetailPage(id), //
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

      expect(prismaService.jobPosting.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        include: includeCompanyAndSelectJobPostingsId,
      });
    });

    it('id에 해당하는 채용공고가 없으면 ForbiddenException 예외를 던져야 함', () => {
      const id = 100;

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(null);

      expect(
        service.getDetailPage(id), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('updateJobPosting', () => {
    it('id에 해당하는 채용공고를 dto로 업데이트하고 리턴해야 함', () => {
      const id = 1;
      const dto = {
        content: '원티드랩에서 NestJS 백엔드 개발자를 채용 중입니다.',
        position: '[신입] NestJS 백엔드 개발자',
      };

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(oneJobPosting);
      jest //
        .spyOn(prismaService.jobPosting, 'update')
        .mockResolvedValueOnce({
          ...oneJobPosting,
          ...dto,
          updatedAt: new Date(2023, 9, 9, 13, 50, 30, 333),
        });

      expect(
        service.updateJobPosting(id, dto), //
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

    it('id에 해당하는 채용공고가 없다면 ForbiddenException 예외를 던져야 함', () => {
      const id = 100;
      const dto = {
        rewards: 50000,
      };

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(null);

      expect(
        service.updateJobPosting(id, dto), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('deleteJobPosting', () => {
    it('{ delete: true }를 리턴해야 함', () => {
      const id = 1;

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(oneJobPosting);
      jest
        .spyOn(prismaService.jobPosting, 'delete')
        .mockResolvedValueOnce(oneJobPosting);

      expect(
        service.deleteJobPosting(id), //
      ).resolves.toEqual({ deleted: true });
    });

    it(`{ deleted: false, message: '삭제 실패'}를 리턴해야 함`, () => {
      const id = 1;

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(oneJobPosting);
      jest
        .spyOn(prismaService.jobPosting, 'delete')
        .mockRejectedValueOnce(new Error('delete fail'));

      expect(
        service.deleteJobPosting(id), //
      ).resolves.toEqual({ deleted: false, message: '삭제 실패' });
    });

    it('id에 해당하는 채용공고를 찾지 못하면 ForbiddenException 예외를 던져야 함', () => {
      const id = 100;

      jest
        .spyOn(prismaService.jobPosting, 'findUnique')
        .mockResolvedValueOnce(null);

      expect(
        service.deleteJobPosting(id), //
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });
});
