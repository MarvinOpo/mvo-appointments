import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentScheduleController } from './department-schedule.controller';
import { DepartmentScheduleService } from './department-schedule.service';

describe('DepartmentScheduleController', () => {
  let controller: DepartmentScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentScheduleController],
      providers: [DepartmentScheduleService],
    }).compile();

    controller = module.get<DepartmentScheduleController>(DepartmentScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
