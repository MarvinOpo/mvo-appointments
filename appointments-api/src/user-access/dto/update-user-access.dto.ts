import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAccessDto } from './create-user-access.dto';

export class UpdateUserAccessDto extends PartialType(CreateUserAccessDto) {}
