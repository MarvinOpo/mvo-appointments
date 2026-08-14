import { Module } from '@nestjs/common';
import { DependentsService } from './dependents.service';
import { DependentsController } from './dependents.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DependentsController],
  providers: [DependentsService],
})
export class DependentsModule {}
