import { Injectable } from '@nestjs/common';

import { vsmmc_services, mvo_appointments } from '../db/prisma';

@Injectable()
export class UsersService {
  findAll() {
    return `This action returns all users`;
  }

  async findAccessRights() {
    return await mvo_appointments.access_rights.findMany();
  }

  async findOne(id: number) {
    return await vsmmc_services.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getAccess(userId: number) {
    return await mvo_appointments.user_access.findFirst({
      where: {
        user_id: userId,
      },
      include: {
        access: true,
      },
    });
  }
}
