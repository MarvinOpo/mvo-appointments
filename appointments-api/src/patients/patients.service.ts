import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

import { vsmmc_services, mvo_appointments } from '../db/prisma';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class PatientsService {
  async create(createPatientDto: CreatePatientDto) {
    return await mvo_appointments.patients.create({
      data: createPatientDto,
    });
  }

  findAll() {
    return `This action returns all patients`;
  }

  async findOne(id: number) {
    const patient = await mvo_appointments.patients.findFirst({
      where: { id },
    });
    return patient || {};
  }

  async findMine(id: number) {
    return await mvo_appointments.patients.findMany({
      select: {
        id: true,
        fname: true,
        lname: true,
        mname: true,
        ext_name: true,
        relationship: true,
        sex: true,
        birth_date: true,
      },
      where: {
        OR: [{ user_id: id }, { owner_user_id: id }],
      },
    });
  }

  async findSelf(user: UserDto) {
    const patient = await mvo_appointments.patients.findFirst({
      where: {
        OR: [
          { user_id: user.id },
          { email: user.email },
          {
            AND: [
              { fname: user.fname },
              { lname: user.lname },
              { mname: user.mname },
              { birth_date: user.birth_date },
            ],
          },
        ],
      },
    });
    return patient || {};
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
