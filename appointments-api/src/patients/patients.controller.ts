import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('mine')
  findMine(@Req() request: Request & { user: UserDto }) {
    return this.patientsService.findMine(request.user.id);
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @Permissions('can_create_ipcr')
  @UseGuards(AuthGuard)
  @Get('self')
  findSelf(@Req() request: Request & { user: UserDto }) {
    return this.patientsService.findSelf(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
