import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportModule } from './report/report.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(), // for cron support (optional)
    ReportModule,
  ],
})
export class AppModule { }
