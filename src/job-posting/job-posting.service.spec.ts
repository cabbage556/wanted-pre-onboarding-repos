import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingService } from './job-posting.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  JobPostingWithCompanyAndJobPostingsId,
  includeCompanyAndSelectJobPostingsId,
} from './infer-types';

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
const companyId = 1;
const jobPostingArray = [
  {
    id: 1,
    createdAt: new Date(2023, 9, 7, 13, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 13, 50, 30, 333),
    content: '채용 중입니다 1',
    position: 'NestJS 백엔드 개발자',
    stack: '#NestJS #Node.js',
    rewards: 100000,
    companyId,
  },
  {
    id: 2,
    createdAt: new Date(2023, 9, 7, 14, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 14, 50, 30, 333),
    content: '채용 중입니다 2',
    position: 'Express 백엔드 개발자',
    stack: '#Express #Node.js',
    rewards: 200000,
    companyId,
  },
  {
    id: 3,
    createdAt: new Date(2023, 9, 7, 15, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 15, 50, 30, 333),
    content: '채용 중입니다 3',
    position: 'Node.js 백엔드 개발자',
    stack: '#Node.js',
    rewards: 300000,
    companyId,
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
              create: jest.fn().mockResolvedValue(oneJobPosting),
              count: jest.fn().mockReturnValue(jobPostingArray.length),
              findMany: jest.fn().mockResolvedValue(jobPostingArray),
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
    it('채용공고를 성공적으로 삽입해야 함', () => {
      expect(
        service.createJobPosting({
          content: '채용 중입니다 1',
          position: 'NestJS 백엔드 개발자',
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId,
        }),
      ).resolves.toEqual(oneJobPosting);
    });

    it('InternalServerErrorException 예외를 던져야 함', async () => {
      jest
        .spyOn(prismaService.jobPosting, 'create')
        .mockImplementationOnce(() => {
          throw new PrismaClientInitializationError(
            'db connection is bad',
            '5.3.1',
          );
        });
      try {
        await service.createJobPosting({
          content: '채용 중입니다 1',
          position: 'NestJS 백엔드 개발자',
          stack: '#NestJS #Node.js',
          rewards: 100000,
          companyId,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('getJobPostings', () => {
    it('page: 1, take:2이면 채용공고 목록 2개와 페이지 메타데이터를 리턴해야 함', async () => {
      const [page, take] = [1, 2];
      jest
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce(
          [...jobPostingArray].slice((page - 1) * take, take),
        );
      expect(
        service.getJobPostings({
          page,
          take,
        }),
      ).resolves.toEqual({
        data: [...jobPostingArray].slice((page - 1) * take, take),
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
      expect(
        service.getJobPostings({
          page: 5,
          take: 2,
        }),
      ).rejects.toThrowError(new ForbiddenException('리소스 접근 거부'));
    });
  });

  describe('searchJobPostings', () => {
    it(`Company 테이블의 name 칼럼에서 '원티드'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      jest //
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce(
          [...jobPostingArray].filter((jobPosting) => {
            const company = companyArray.find(
              (company) => company.id === jobPosting.companyId,
            );
            return company.name.includes('원티드');
          }),
        );

      expect(
        service.searchJobPostings({
          search: '원티드',
          field: 'company',
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
          companyId,
        },
        {
          id: 2,
          createdAt: new Date(2023, 9, 7, 14, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 14, 50, 30, 333),
          content: '채용 중입니다 2',
          position: 'Express 백엔드 개발자',
          stack: '#Express #Node.js',
          rewards: 200000,
          companyId,
        },
        {
          id: 3,
          createdAt: new Date(2023, 9, 7, 15, 50, 30, 333),
          updatedAt: new Date(2023, 9, 7, 15, 50, 30, 333),
          content: '채용 중입니다 3',
          position: 'Node.js 백엔드 개발자',
          stack: '#Node.js',
          rewards: 300000,
          companyId,
        },
      ]);
    });
    it(`Company 테이블의 name 칼럼에서 '에이스'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      jest //
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce(
          [...jobPostingArray].filter((jobPosting) => {
            const company = companyArray.find(
              (company) => company.id === jobPosting.companyId,
            );
            return company.name.includes('에이스');
          }),
        );

      expect(
        service.searchJobPostings({
          search: '에이스',
          field: 'company',
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
      ]);
    });
    it(`JobPosting 테이블의 position 칼럼에서 'Nest'를 검색해 해당하는 채용공고를 리턴해야 함`, () => {
      jest
        .spyOn(prismaService.jobPosting, 'findMany')
        .mockResolvedValueOnce(
          [...jobPostingArray].filter((jobPosting) =>
            jobPosting.position.includes('Nest'),
          ),
        );

      expect(
        service.searchJobPostings({
          search: 'Nest',
          field: 'position',
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
      expect(service.getDetailPage(id)).resolves.toEqual({
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

      expect(service.getDetailPage(id)).rejects.toThrowError(
        new ForbiddenException('리소스 접근 거부'),
      );
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
        companyId,
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
