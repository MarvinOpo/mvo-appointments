import { Injectable } from '@nestjs/common';
import { CreateDepartmentScheduleDto } from './dto/create-department-schedule.dto';
import { UpdateDepartmentScheduleDto } from './dto/update-department-schedule.dto';

import { mvo_appointments } from '../db/prisma';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class DepartmentScheduleService {
  async create(id: number, dto: CreateDepartmentScheduleDto) {
    const { start, end, ...rest } = dto;

    return await mvo_appointments.department_schedule.create({
      data: {
        dept_id: id,
        ...rest,
        start: dayjs.utc(start, 'HH:mm').toDate(),
        end: dayjs.utc(end, 'HH:mm').toDate(),
      },
    });
  }

  findAll() {
    return `This action returns all departmentSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} departmentSchedule`;
  }

  async update(
    id: number,
    updateDepartmentScheduleDto: UpdateDepartmentScheduleDto,
  ) {
    const { start, end, ...rest } = updateDepartmentScheduleDto;

    return await mvo_appointments.department_schedule.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        start: dayjs.utc(start, 'HH:mm').toDate(),
        end: dayjs.utc(end, 'HH:mm').toDate(),
      },
    });
  }

  async remove(id: number) {
    return await mvo_appointments.department_schedule.delete({
      where: {
        id: id,
      },
    });
  }
}
