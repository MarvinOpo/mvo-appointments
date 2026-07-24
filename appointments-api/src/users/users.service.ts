import { Injectable } from '@nestjs/common';

import { vsmmc_services, mvo_appointments } from '../db/prisma';

@Injectable()
export class UsersService {
  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return await vsmmc_services.users.findUnique({
      where: {
        id: id,
      },
      include: {
        services_rights: {
          where: { service_id: 4 },
        },
      },
    });
  }

  async getAccess(id: number) {
    return await mvo_appointments.access_rights.findFirst({
      where: {
        id: id,
      },
    });
  }
}
