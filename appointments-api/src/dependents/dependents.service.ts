import { Injectable } from '@nestjs/common';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';

@Injectable()
export class DependentsService {
  create(createDependentDto: CreateDependentDto) {
    return 'This action adds a new dependent';
  }

  findAll() {
    return `This action returns all dependents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dependent`;
  }

  update(id: number, updateDependentDto: UpdateDependentDto) {
    return `This action updates a #${id} dependent`;
  }

  remove(id: number) {
    return `This action removes a #${id} dependent`;
  }
}
