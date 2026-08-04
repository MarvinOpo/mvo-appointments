import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { mvo_appointments } from '../db/prisma';

@Injectable()
export class DepartmentsService {
  async create(createDepartmentDto: CreateDepartmentDto) {
    return await mvo_appointments.departments.create({
      data: createDepartmentDto,
    });
  }

  findAll() {
    return mvo_appointments.departments.findMany({
      include: {
        schedules: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return await mvo_appointments.departments.update({
      where: {
        id: id,
      },
      data: updateDepartmentDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
