import { Module } from '@nestjs/common';
import { DependentsService } from './dependents.service';
import { DependentsController } from './dependents.controller';

@Module({
  controllers: [DependentsController],
  providers: [DependentsService],
})
export class DependentsModule {}
