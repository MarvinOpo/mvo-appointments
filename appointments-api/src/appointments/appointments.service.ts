import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async findAppointmentByStatus(
    status: string | string[],
    filters: {
      fname?: string;
      lname?: string;
      type?: string;
      schedule?: string;
    },
  ) {
    const { fname, lname, type, schedule } = filters;

    const patientFilter = {
      ...(fname && { fname: { contains: fname } }),
      ...(lname && { lname: { contains: lname } }),
    };

    return await mvo_appointments.appointments.findMany({
      where: {
        status: Array.isArray(status) ? { in: status } : status,
        ...(Object.keys(patientFilter).length && { patient: patientFilter }),
        ...(type && { type }),
        ...(schedule && {
          scheduled_at: {
            gte: dayjs.utc(schedule).startOf('day').toDate(),
            lte: dayjs.utc(schedule).endOf('day').toDate(),
          },
        }),
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
      orderBy: [{ scheduled_at: 'asc' }, { order_no: 'asc' }],
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

      const result = await tx.appointments.aggregate({
        where: {
          department_id: appointment.department_id,
          scheduled_at: appointment.scheduled_at,
        },
        _max: {
          queue_no: true,
          order_no: true,
        },
      });

      const nextQueueNo = (result._max.queue_no ?? 0) + 1;
      const nextOrderNo = (result._max.order_no ?? 0) + 1;

      await this.createLogs(
        tx,
        id,
        'Appointment Approved',
        updateAppointmentDto.remarks ?? 'Your appointment has been approved.',
      );

      return await tx.appointments.update({
        where: { id: id },
        data: {
          step: 2,
          status: 'O',
          queue_no: nextQueueNo,
          order_no: nextOrderNo,
        },
      });
    });
  }

  async resched(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return await mvo_appointments.$transaction(async (tx) => {
      const existingAppt = await tx.$queryRaw<Appointment[]>`
        SELECT * FROM appointments
        WHERE id = ${id}
        FOR UPDATE
      `;

      if (!existingAppt.length)
        throw new NotFoundException('Appointment not found.');

      const appointment = existingAppt[0];

      const pendingAppts = await tx.$queryRaw<Appointment[]>`
        SELECT * FROM appointments
        WHERE user_id = ${appointment.user_id} AND step <= 2 AND id != ${id}
        FOR UPDATE
      `;

      if (pendingAppts.length > 2)
        throw new ConflictException('You already have 3 pending appointments.');

      const sameDepartmentPending = pendingAppts.some(
        (a) =>
          a.patient_id === appointment.patient_id &&
          a.department_id ===
            (updateAppointmentDto.department_id ?? appointment.department_id),
      );

      if (sameDepartmentPending)
        throw new ConflictException(
          'This patient already has a pending appointment for this department. Please complete it before booking another.',
        );

      const appt = await tx.appointments.update({
        where: { id },
        data: {
          ...updateAppointmentDto,
          step: 2,
          status: 'O',
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
      });

      await this.createLogs(
        tx,
        appt.id,
        'Reschedule Appointment',
        'Successfully rescheduled an appointment',
      );

      return appt;
    });
  }

  async cancel(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return await mvo_appointments.$transaction(async (tx) => {
      await this.createLogs(
        tx,
        id,
        'Appointment Cancelled',
        `Remarks: ${updateAppointmentDto.remarks}`,
      );

      return await tx.appointments.update({
        where: { id: id },
        data: {
          status: 'X',
        },
      });
    });
  }

  async updateStep(id: number, step: number) {
    return await mvo_appointments.$transaction(async (tx) => {
      let action = '';
      let remarks = '';

      const data: { step?: number; status?: string } = {
        step: step + 1,
      };

      switch (step) {
        case 2:
          action = 'Checked In';
          remarks = 'Patient checked in and queued for vital signs.';
          break;
        case 3:
          action = 'Vital Signs';
          remarks = 'Vital signs taken; patient queued for consultation.';
          break;
        case 4:
          action = 'Consultation';
          remarks = 'Consultation completed. Appointment closed.';
          data.status = 'C';
          break;
      }

      await this.createLogs(tx, id, action, remarks);

      return await tx.appointments.update({
        where: { id: id },
        data,
      });
    });
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
