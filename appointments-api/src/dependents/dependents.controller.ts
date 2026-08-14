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
import { DependentsService } from './dependents.service';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('dependents')
export class DependentsController {
  constructor(private readonly dependentsService: DependentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDependentDto: CreateDependentDto) {
    return this.dependentsService.create(createDependentDto);
  }

  @UseGuards(AuthGuard)
  @Get('mine')
  findMine(@Req() request: Request & { user: UserDto }) {
    return this.dependentsService.findMine(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dependentsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dependentsService.remove(+id);
  }
}
