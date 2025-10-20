import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    // API tạo báo cáo trong 24h
    @Get()
    async createReport(@Query('since') since?: string, @Query('author') author?: string) {
        const result = await this.reportService.generateMarkdownReport(since || '1 day ago', author);
        return result;
    }
}
