import { Test, TestingModule } from '@nestjs/testing';
import { RedisconfigService } from './redisconfig.service';

describe('RedisconfigService', () => {
  let service: RedisconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisconfigService],
    }).compile();

    service = module.get<RedisconfigService>(RedisconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
