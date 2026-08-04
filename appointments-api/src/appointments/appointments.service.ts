import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { mvo_appointments } from '../db/prisma';
import { Prisma } from 'prisma-appointments/client/client';
import { Appointment } from './entities/appointment.entity';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class AppointmentsService {
  async create(createAppointmentDto: CreateAppointmentDto) {
    return await mvo_appointments.$transaction(async (tx) => {
      const pendingAppts = await tx.$queryRaw<Appointment[]>`
          SELECT * FROM appointments
          WHERE user_id = ${createAppointmentDto.user_id} AND step <= 2
          FOR UPDATE
        `;

      if (pendingAppts.length > 2)
        throw new ConflictException('You already have 3 pending appointments.');

      const sameDepartmentPending = pendingAppts.some(
        (a) =>
          a.patient_id === createAppointmentDto.patient_id &&
          a.department_id === createAppointmentDto.department_id,
      );

      if (sameDepartmentPending)
        throw new ConflictException(
          'This patient already has a pending appointment for this department. Please complete it before booking another.',
        );

      const appt = await tx.appointments.create({
        data: createAppointmentDto,
        include: {
          patient: {
            select: { fname: true, lname: true, mname: true, ext_name: true },
          },
          department: { select: { name: true } },
        },
      });

      await this.createLogs(
        tx,
        appt.id,
        'Make Appointment',
        'Successfully booked an appointment',
      );

      return appt;
    });
  }
  findAll() {
    return `This action returns all mvo_appointments`;
  }

  async findMine(id: number) {
    return await mvo_appointments.appointments.findMany({
      where: {
        user_id: id,
      },
      include: {
        patient: {
          select: {
            fname: true,
            lname: true,
            mname: true,
            ext_name: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findAppointmentByStatus(status: string | string[]) {
    return await mvo_appointments.appointments.findMany({
      where: {
        status: Array.isArray(status) ? { in: status } : status,
      },
      include: {
        patient: {
          select: {
            fname: true,
            lname: true,
            mname: true,
            ext_name: true,
            email: true,
            birth_date: true,
            mobile_no: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        scheduled_at: 'asc',
      },
    });
  }

  async findScheduled(deptId: number, start: string, end: string) {
    return await mvo_appointments.appointments.findMany({
      select: {
        id: true,
        scheduled_at: true,
        queue_no: true,
        step: true,
      },
      where: {
        department_id: deptId,
        scheduled_at: {
          gte: dayjs.utc(start).toDate(),
          lte: dayjs.utc(end).toDate(),
        },
        status: {
          in: ['P', 'O'],
        },
      },
      orderBy: {
        queue_no: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async findLogs(id: number) {
    return await mvo_appointments.appointment_logs.findMany({
      where: {
        appointment_id: id,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async createLogs(
    tx: Prisma.TransactionClient,
    apptId: number,
    action: string,
    remarks: string,
  ) {
    return await mvo_appointments.appointment_logs.create({
      data: {
        appointment_id: apptId,
        action: action,
        remarks: remarks,
      },
    });
  }

  async approve(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return await mvo_appointments.$transaction(async (tx) => {
      const appointment = await tx.appointments.findUniqueOrThrow({
        where: { id: id },
      });

      const startOfDay = dayjs
        .utc(appointment.scheduled_at)
        .startOf('day')
        .toDate();
      const endOfDay = dayjs
        .utc(appointment.scheduled_at)
        .endOf('day')
        .toDate();

      const result = await tx.appointments.aggregate({
        where: {
          department_id: appointment.department_id,
          scheduled_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _max: {
          queue_no: true,
        },
      });

      const nextQueueNo = (result._max.queue_no ?? 0) + 1;

      await this.createLogs(
        tx,
        id,
        'Appointment Approved',
        updateAppointmentDto.remarks ?? 'Your appointment has been approved.',
      );

      return tx.appointments.update({
        where: { id: id },
        data: {
          step: 2,
          status: 'O',
          queue_no: nextQueueNo,
        },
      });
    });
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
