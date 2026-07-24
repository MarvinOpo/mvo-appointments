import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DependentsService } from './dependents.service';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';

@Controller('dependents')
export class DependentsController {
  constructor(private readonly dependentsService: DependentsService) {}

  @Post()
  create(@Body() createDependentDto: CreateDependentDto) {
    return this.dependentsService.create(createDependentDto);
  }

  @Get()
  findAll() {
    return this.dependentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dependentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDependentDto: UpdateDependentDto) {
    return this.dependentsService.update(+id, updateDependentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dependentsService.remove(+id);
  }
}
