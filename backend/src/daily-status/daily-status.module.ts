import { Module } from '@nestjs/common';
import { DailyStatusService } from './daily-status.service';
import { DailyStatusController } from './daily-status.controller';

@Module({
  controllers: [DailyStatusController],
  providers: [DailyStatusService],
})
export class DailyStatusModule {}
