import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

import { mvo_appointments } from '../db/prisma';

@Injectable()
export class MonitorsService {
  async create(createMonitorDto: CreateMonitorDto) {
    return await mvo_appointments.queue_monitors.create({
      data: createMonitorDto,
    });
  }

  async findAll() {
    return await mvo_appointments.queue_monitors.findMany();
  }

  async findOne(id: number) {
    const monitor = await mvo_appointments.queue_monitors.findUnique({
      where: { id },
    });

    if (!monitor) {
      throw new NotFoundException('Monitor not found');
    }

    const deptIds = monitor.dept_ids as number[];

    const departments = await mvo_appointments.departments.findMany({
      where: { id: { in: deptIds } },
      select: { id: true, name: true, code: true },
    });

    return { ...monitor, departments };
  }

  async update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return await mvo_appointments.queue_monitors.update({
      where: { id },
      data: updateMonitorDto,
    });
  }

  async remove(id: number) {
    return await mvo_appointments.queue_monitors.delete({ where: { id } });
  }
}
