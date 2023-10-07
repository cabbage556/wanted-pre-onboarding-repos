import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingService } from './job-posting.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { InternalServerErrorException } from '@nestjs/common';

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
    createdAt: new Date(2023, 9, 7, 14, 50, 30, 333),
    updatedAt: new Date(2023, 9, 7, 14, 50, 30, 333),
    content: '채용 중입니다 3',
    position: 'Node.js 백엔드 개발자',
    stack: '#Node.js',
    rewards: 300000,
    companyId,
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
});
