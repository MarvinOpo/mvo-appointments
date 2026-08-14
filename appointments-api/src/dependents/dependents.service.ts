import { Injectable } from '@nestjs/common';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';

import { mvo_appointments } from '../db/prisma';

@Injectable()
export class DependentsService {
  create(createDependentDto: CreateDependentDto) {
    return 'This action adds a new dependent';
  }

  async findMine(id: number) {
    return await mvo_appointments.patients.findMany({
      where: { owner_user_id: id },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} dependent`;
  }

  remove(id: number) {
    return `This action removes a #${id} dependent`;
  }
}
