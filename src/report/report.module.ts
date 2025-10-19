import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TelegramService } from './telegram.service';

@Module({
    controllers: [ReportController],
    providers: [ReportService, TelegramService],
    exports: [ReportService],
})
export class ReportModule { }
