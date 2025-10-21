import { Injectable, Logger } from '@nestjs/common';
import simpleGit, { SimpleGit } from 'simple-git';
import dayjs from 'dayjs';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);
    private git: SimpleGit = simpleGit();
    private reportDir = process.env.REPORT_DIR || './reports';

    /**
     * Lấy danh sách commit từ Git
     * ----------------------------------
     * @param since - Khoảng thời gian muốn lấy 
     * @param authorFilter - Lọc theo tác giả cụ thể
     * 
     * Mặc định: since = '1 day ago' (tức 24h qua)
     */
    async getCommits(since = '1 day ago', authorFilter?: string) {
        try {
            // Nếu không truyền since → mặc định là 24h qua
            const logs = await this.git.log([`--since=${since}`]);

            // Lọc danh sách commit (nếu có lọc theo tác giả)
            let commits = logs.all.map(c => ({
                message: c.message,
                author: c.author_name,
                date: c.date,
                hash: c.hash,
            }));

            if (authorFilter) {
                commits = commits.filter(c => c.author.toLowerCase().includes(authorFilter.toLowerCase()));
            }

            // Ghi log lại số lượng commit tìm thấy
            this.logger.log(`Fetched ${commits.length} commits since "${since}"${authorFilter ? ` by "${authorFilter}"` : ''}`);

            return commits;
        } catch (error) {
            this.logger.error('Error fetching commits:', error);
            return [];
        }
    }

    /**
     * Sinh file báo cáo dạng Markdown
     * ----------------------------------
     * @param since - Thời gian muốn lấy commit (VD: '3 days ago', '1 week ago')
     * @param authorFilter - Tên tác giả (nếu muốn lọc)
     * 
     * - Nếu không có commit nào → Ghi rõ “Không có commit nào trong ...”
     * - Nếu có → Ghi commit theo ngày
     */
    async generateMarkdownReport(since = '1 day ago', authorFilter?: string) {
        const commits = await this.getCommits(since, authorFilter);
        const date = dayjs().format('YYYY-MM-DD');
        const filePath = `${this.reportDir}/daily-${date}.md`;

        // Đảm bảo thư mục tồn tại
        await fs.ensureDir(this.reportDir);

        // Nếu không có commit nào
        if (commits.length === 0) {
            const content = `# Báo cáo Daily Standup (${date})\n\nKhông có commit nào trong ${since}${authorFilter ? ` của tác giả "${authorFilter}".` : '.'
                }\n`;
            await fs.writeFile(filePath, content, 'utf-8');
            this.logger.log(`Report generated (no commits): ${filePath}`);

            return {
                message: `Không có commit nào trong ${since}${authorFilter ? ` của tác giả "${authorFilter}"` : ''}`,
                path: filePath,
                commitsCount: 0,
                content,
            };
        }

        // Nhóm commit theo ngày
        const groupedByDate = commits.reduce((acc, c) => {
            const day = dayjs(c.date).format('YYYY-MM-DD');
            acc[day] = acc[day] || [];
            acc[day].push(c);
            return acc;
        }, {} as Record<string, typeof commits>);

        // Tạo nội dung Markdown
        let content = `# Báo cáo Daily Standup (${date})\n\n`;

        for (const [commitDate, list] of Object.entries(groupedByDate)) {
            content += `## Ngày ${commitDate}:\n`;
            list.forEach(c => {
                content += `- ${c.date} ${c.message} *${c.author}* (${c.hash.slice(0, 7)})\n`;
            });
            content += `\n`;
        }

        await fs.writeFile(filePath, content, 'utf-8');
        this.logger.log(`Report generated: ${filePath}`);

        return {
            message: 'Report generated successfully',
            path: filePath,
            commitsCount: commits.length,
            content,
        };
    }
}
