import { Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

import { mvo_appointments } from '../db/prisma';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class HolidaysService {
  async create(createHolidayDto: CreateHolidayDto) {
    return await mvo_appointments.holidays.create({ data: createHolidayDto });
  }

  async findAll() {
    return await mvo_appointments.holidays.findMany({
      where: { date: { gte: dayjs().startOf('day').toDate() } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} holiday`;
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto) {
    return await mvo_appointments.holidays.update({
      where: { id: id },
      data: updateHolidayDto,
    });
  }

  async remove(id: number) {
    return await mvo_appointments.holidays.delete({ where: { id: id } });
  }
}
