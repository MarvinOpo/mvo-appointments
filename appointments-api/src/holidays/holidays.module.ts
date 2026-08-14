import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HolidaysController],
  providers: [HolidaysService],
})
export class HolidaysModule {}
