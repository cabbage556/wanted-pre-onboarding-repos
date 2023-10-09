import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('createApplication', () => {
    const dto = {
      userId: 1,
      jobPostingId: 1,
    };

    it('지원내역 레코드를 생성하고 리턴해야 함', () => {
      jest //
        .spyOn(prismaService.application, 'create')
        .mockResolvedValueOnce({
          id: 1,
          createdAt: new Date(2023, 9, 9, 5, 23, 6, 852),
          ...dto,
        });

      expect(
        service.createApplication(dto), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 9, 5, 23, 6, 852),
        userId: 1,
        jobPostingId: 1,
      });
    });

    it('이미 지원했다면 ForbiddenException 예외를 던져야 함', () => {
      jest
        .spyOn(prismaService.application, 'create')
        .mockRejectedValueOnce(
          new PrismaClientKnownRequestError(
            'userId, jobPostingId already exists',
            { code: 'P2002', clientVersion: '5.3.1' },
          ),
        );

      expect(
        service.createApplication(dto), //
      ).rejects.toThrowError(new ForbiddenException('이미 지원하였음'));
    });
  });
});
