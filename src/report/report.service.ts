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

        let content = `# 🧠 Báo cáo Daily Standup (${date})\n\n`;
        if (commits.length === 0) {
            content += 'Không có commit nào trong 24 giờ qua.\n';
        } else {
            content += '## 🔹 Hôm qua:\n';
            commits.forEach(c => {
                content += `- (${c.date}) ${c.message} — *${c.author}* ( ${c.hash.slice(0, 7)} )\n`;
            });
            content += '\n## 🔹 Hôm nay:\n- Tiếp tục công việc đang dang dở.\n';
            content += '\n## 🔹 Blockers:\n- Không có (hoặc ghi blocker nếu có)\n';
        }

        await fs.ensureDir(this.reportDir);
        await fs.writeFile(filePath, content, 'utf-8');

        this.logger.log(`Report generated: ${filePath}`);
        return { message: 'Report generated', path: filePath, commitsCount: commits.length, content };
    }
}
