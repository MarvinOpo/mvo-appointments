import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentScheduleService } from './department-schedule.service';

describe('DepartmentScheduleService', () => {
  let service: DepartmentScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentScheduleService],
    }).compile();

    service = module.get<DepartmentScheduleService>(DepartmentScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
