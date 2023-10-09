import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ForbiddenException } from '@nestjs/common';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: ApplicationService,
          useValue: {
            createApplication: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApplication', () => {
    const dto = {
      userId: 1,
      jobPostingId: 1,
    };

    it('지원내역을 리턴해야 함', () => {
      jest //
        .spyOn(service, 'createApplication')
        .mockResolvedValueOnce({
          id: 1,
          createdAt: new Date(2023, 9, 9, 6, 10, 37, 112),
          ...dto,
        });

      expect(
        controller.createApplication(dto), //
      ).resolves.toEqual({
        id: 1,
        createdAt: new Date(2023, 9, 9, 6, 10, 37, 112),
        userId: 1,
        jobPostingId: 1,
      });
    });

    it('ForbiddenException 예외를 던져야 함', () => {
      jest
        .spyOn(service, 'createApplication')
        .mockRejectedValueOnce(new ForbiddenException('이미 지원하였음'));

      expect(
        controller.createApplication(dto), //
      ).rejects.toThrowError(new ForbiddenException('이미 지원하였음'));
    });
  });
});
