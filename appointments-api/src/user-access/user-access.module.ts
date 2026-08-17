import { Module } from '@nestjs/common';
import { UserAccessService } from './user-access.service';
import { UserAccessController } from './user-access.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserAccessController],
  providers: [UserAccessService],
})
export class UserAccessModule {}
