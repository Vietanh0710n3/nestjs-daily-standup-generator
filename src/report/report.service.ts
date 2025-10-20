import { Injectable, Logger } from '@nestjs/common';
import simpleGit, { SimpleGit } from 'simple-git';
import * as dayjs from 'dayjs';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);
    private git: SimpleGit = simpleGit();
    private reportDir = process.env.REPORT_DIR || './reports';

    async getCommits(since = '1 day ago', authorFilter?: string) {
        try {
            // Lấy ngày cụ thể, ví dụ: 2025-10-18
            const sinceDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

            // Truyền tham số đúng cho simple-git
            const logs = await this.git.log([`--since=${sinceDate}`]);

            // Lọc ra danh sách commit (nếu muốn lọc theo author)
            let commits = logs.all.map(c => ({
                message: c.message,
                author: c.author_name,
                date: c.date,
                hash: c.hash,
            }));

            if (authorFilter) {
                commits = commits.filter(c => c.author.includes(authorFilter));
            }

            return commits;
        } catch (error) {
            this.logger.error('Error fetching commits:', error);
            return [];
        }
    }

    async generateMarkdownReport(since = '1 day ago', authorFilter?: string) {
        const commits = await this.getCommits(since, authorFilter);
        const date = dayjs().format('YYYY-MM-DD');
        const filePath = `${this.reportDir}/daily-${date}.md`;

        // Nếu không có commit nào trong 24h qua
        if (commits.length === 0) {
            const content = `# Báo cáo Daily Standup (${date})\n\nKhông có commit nào trong 24 giờ qua.\n`;
            await fs.ensureDir(this.reportDir);
            await fs.writeFile(filePath, content, 'utf-8');
            this.logger.log(`Report generated: ${filePath}`);
            return { message: 'No commits in last 24h', path: filePath, commitsCount: 0, content };
        }

        // Nhóm commit theo ngày
        const today = dayjs().format('YYYY-MM-DD');
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        const commitsToday = commits.filter(c => dayjs(c.date).format('YYYY-MM-DD') === today);
        const commitsYesterday = commits.filter(c => dayjs(c.date).format('YYYY-MM-DD') === yesterday);

        let content = `# Báo cáo Daily Standup (${date})\n\n`;

        if (commitsYesterday.length > 0) {
            content += `## Hôm qua (${yesterday}):\n`;
            commitsYesterday.forEach(c => {
                content += `- ${c.date} ${c.message} – *${c.author}* (${c.hash.slice(0, 7)})\n`;
            });
            content += `\n`;
        }

        if (commitsToday.length > 0) {
            content += `## Hôm nay (${today}):\n`;
            commitsToday.forEach(c => {
                content += `- ${c.date} ${c.message} – *${c.author}* (${c.hash.slice(0, 7)})\n`;
            });
            content += `\n`;
        }

        if (commitsYesterday.length === 0 && commitsToday.length === 0) {
            content += `Không có commit nào trong 24 giờ qua.\n`;
        }

        content += `## Tiếp tục công việc:\n\n`;
        content += `## Blockers:\nKhông có (hoặc ghi blocker nếu có)\n`;

        await fs.ensureDir(this.reportDir);
        await fs.writeFile(filePath, content, 'utf-8');

        this.logger.log(`Report generated: ${filePath}`);
        return {
            message: 'Report generated',
            path: filePath,
            commitsCount: commits.length,
            content,
        };
    }

}
