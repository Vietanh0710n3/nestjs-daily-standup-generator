import 'ts-node/register';
import { ReportService } from './report.service';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
    const rs = new ReportService();
    const res = await rs.generateMarkdownReport('1 day ago');
    console.log(res);
})();
