import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserAccessDto } from './dto/create-user-access.dto';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';

import { mvo_appointments, vsmmc_services } from 'src/db/prisma';

@Injectable()
export class UserAccessService {
  async create(createUserAccessDto: CreateUserAccessDto) {
    const { email, access_right, dept_ids } = createUserAccessDto;

    const user = await vsmmc_services.users.findFirst({
      where: { email },
    });

    if (!user) throw new NotFoundException('User not found.');

    const existing = await mvo_appointments.user_access.findUnique({
      where: { user_id: user.id },
    });

    if (existing) {
      throw new ConflictException('User already has an access record.');
    }

    const userAccess = await mvo_appointments.user_access.create({
      data: {
        user_id: user.id,
        access_right,
        dept_ids,
      },
    });

    const result = await mvo_appointments.$queryRaw<any[]>`
      SELECT ua.*, u.email, u.fname, u.lname, u.mname 
      FROM user_access ua
      LEFT JOIN vsmmc_services.users u 
        ON u.id = ua.user_id
      WHERE ua.id = ${userAccess.id}
    `;

    return result[0];
  }

  async findAll() {
    return await mvo_appointments.$queryRaw`
      SELECT ua.*, u.email, u.fname, u.lname, u.mname 
      FROM user_access ua
      LEFT JOIN vsmmc_services.users u 
        ON u.id = ua.user_id
      ORDER BY u.fname
    `;
  }

  async findOne(id: number) {
    return `This action returns a #${id} userAccess`;
  }

  async update(id: number, updateUserAccessDto: UpdateUserAccessDto) {
    const { access_right, dept_ids } = updateUserAccessDto;

    const existing = await mvo_appointments.user_access.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('User access record not found.');
    }

    await mvo_appointments.user_access.update({
      where: { id },
      data: {
        ...(access_right !== undefined && { access_right }),
        ...(dept_ids !== undefined && { dept_ids }),
      },
    });

    const result = await mvo_appointments.$queryRaw<any[]>`
      SELECT ua.*, u.email, u.fname, u.lname, u.mname 
      FROM user_access ua
      LEFT JOIN vsmmc_services.users u 
        ON u.id = ua.user_id
      WHERE ua.id = ${id}
    `;

    return result[0];
  }

  remove(id: number) {
    return `This action removes a #${id} userAccess`;
  }
}
