import { Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

import { mvo_appointments } from '../db/prisma';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class QueueService {
  async create(createQueueDto: CreateQueueDto) {
    const { deptId, date } = createQueueDto;
    const sessionDate = new Date(`${date}T00:00:00.000Z`);

    const existing = await mvo_appointments.queue_sessions.findFirst({
      where: { dept_id: deptId, session_date: sessionDate },
      include: { stats: true },
    });

    if (existing) {
      return existing;
    }

    return await mvo_appointments.$transaction(async (tx) => {
      const session = await tx.queue_sessions.create({
        data: {
          dept_id: deptId,
          session_date: sessionDate,
          has_started: true,
        },
      });

      await tx.queue_session_stat.createMany({
        data: [2, 3, 4].map((step) => ({
          session_id: session.id,
          step,
        })),
      });

      return tx.queue_sessions.findFirst({
        where: { id: session.id },
        include: { stats: true },
      });
    });
  }

  findAll() {
    return `This action returns all queue`;
  }

  async findTodayQueueSession(date: string) {
    const sessionDate = new Date(`${date}T00:00:00.000Z`);
    return await mvo_appointments.queue_sessions.findMany({
      where: {
        session_date: sessionDate,
      },
      include: {
        stats: true,
      },
    });
  }

  async findQueueSession(deptId: number, date: string) {
    const sessionDate = new Date(`${date}T00:00:00.000Z`);

    const session = await mvo_appointments.queue_sessions.findFirst({
      where: {
        dept_id: deptId,
        session_date: sessionDate,
      },
      include: {
        stats: true,
      },
    });

    return session ?? {};
  }

  findOne(id: number) {
    return `This action returns a #${id} queue`;
  }

  update(id: number, updateQueueDto: UpdateQueueDto) {
    return `This action updates a #${id} queue`;
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
