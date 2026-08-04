import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartmentScheduleService } from './department-schedule.service';
import { CreateDepartmentScheduleDto } from './dto/create-department-schedule.dto';
import { UpdateDepartmentScheduleDto } from './dto/update-department-schedule.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('departments/:id/schedules')
export class DepartmentScheduleController {
  constructor(
    private readonly departmentScheduleService: DepartmentScheduleService,
  ) {}

  @UseGuards(AuthGuard)
  @Permissions('can_manage_departments')
  @Post()
  create(
    @Param('id') id: string,
    @Body() createDepartmentScheduleDto: CreateDepartmentScheduleDto,
  ) {
    return this.departmentScheduleService.create(
      +id,
      createDepartmentScheduleDto,
    );
  }

  @Get()
  findAll() {
    return this.departmentScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentScheduleDto: UpdateDepartmentScheduleDto,
  ) {
    return this.departmentScheduleService.update(
      +id,
      updateDepartmentScheduleDto,
    );
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_departments')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentScheduleService.remove(+id);
  }
}
