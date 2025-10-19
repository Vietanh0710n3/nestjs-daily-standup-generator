import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    // GET /report?since=2 days ago&author=Nguyễn
    @Get()
    async createReport(@Query('since') since?: string, @Query('author') author?: string) {
        const result = await this.reportService.generateMarkdownReport(since || '1 day ago', author);
        return result;
    }
}
