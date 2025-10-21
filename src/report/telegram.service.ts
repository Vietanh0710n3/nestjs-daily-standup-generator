// import { Injectable, Logger } from '@nestjs/common';
// import * as fs from 'fs';
// import axios from 'axios';
// import FormData from 'form-data';
// import * as dotenv from 'dotenv';
// dotenv.config();

// @Injectable()
// export class TelegramService {
//     private readonly logger = new Logger(TelegramService.name);
//     private token = process.env.TELEGRAM_BOT_TOKEN;
//     private chatId = process.env.TELEGRAM_CHAT_ID;

//     async sendDocument(filePath: string, caption = '') {
//         if (!this.token || !this.chatId) {
//             this.logger.warn('Telegram token/chatId not configured.');
//             return { ok: false, msg: 'Not configured' };
//         }
//         const url = `https://api.telegram.org/bot${this.token}/sendDocument`;
//         const form = new FormData();
//         form.append('chat_id', this.chatId);
//         form.append('caption', caption);
//         form.append('document', fs.createReadStream(filePath));

//         try {
//             const res = await axios.post(url, form, { headers: form.getHeaders() });
//             this.logger.log('Sent report to Telegram');
//             return res.data;
//         } catch (err: any) {
//             this.logger.error('Telegram send error: ' + err.message);
//             return { ok: false, err: err.message };
//         }
//     }
// }
