# NestJS Daily Standup Generator

Tự động tạo báo cáo daily standup từ Git commits trong 24 giờ qua.

## 💡 Ý tưởng
Dự án giúp tự động tổng hợp commit hằng ngày của developer và xuất ra file markdown dạng báo cáo.

## 🚀 Tính năng chính

- ✅ Lấy commit gần nhất trong repo Git.
- ✅ Lọc commit theo **thời gian** và **tác giả**.
- ✅ Tự động sinh file báo cáo dạng **Markdown (.md)**.
- ✅ Phân chia commit thành **“Hôm qua”** và **“Hôm nay”**.
- ✅ Hiển thị commit dưới dạng chi tiết: `time`, `message`, `author`, `hash`.
- ✅ Tùy chỉnh đường dẫn lưu file báo cáo qua biến môi trường.

## 🧩 Công nghệ sử dụng

| Công nghệ | Mục đích |
|------------|-----------|
| **NestJS** | Xây dựng API backend |
| **simple-git** | Lấy lịch sử commit từ Git |
| **dayjs** | Xử lý và định dạng ngày giờ |
| **fs-extra** | Ghi và quản lý file báo cáo |
| **dotenv** | Đọc biến môi trường từ `.env` |

## ⚙️ Cài đặt

```bash
git clone https://github.com/Vietanh0710n3/nestjs-daily-standup-generator
cd nestjs-daily-standup-generator
npm install
npm run start

