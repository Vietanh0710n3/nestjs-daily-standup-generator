import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
    private readonly logger = new Logger(ReportController.name);

    constructor(private readonly reportService: ReportService) {}

    /**
     * API: Tạo báo cáo commit
     * ---------------------------------------
     * - Mặc định: lấy commit trong 24h qua (1 day ago)
     * - Có thể truyền thời gian khác (VD: ?since=3 days ago)
     * - Có thể lọc theo tác giả (VD: ?author=Vietanh)
     *
     * Ví dụ:
     *   GET /report
     *   GET /report?since=3 days ago
     *   GET /report?author=Vietanh
     *   GET /report?since=1 week ago&author=Vietanh
     */
    @Get()
    async createReport(
        @Query('since') since?: string,
        @Query('author') author?: string,
    ) {
        // Nếu không truyền since thì mặc định là "1 day ago"
        const sinceValue = since || '1 day ago';

        this.logger.log(
            `Generating report (since="${sinceValue}"${
                author ? `, author="${author}"` : ''
            })...`,
        );

        // Gọi service xử lý logic và tạo file markdown
        const result = await this.reportService.generateMarkdownReport(
            sinceValue,
            author,
        );

        this.logger.log(
            `Report done (${result.commitsCount} commits found, saved to: ${result.path})`,
        );

        return result;
    }
}
