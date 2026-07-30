# AI Text-to-Speech Studio Pro 🎙️✨

Ứng dụng web chuyển đổi văn bản thành giọng nói AI chuyên nghiệp với **Google Gemini 3.1 TTS**, hỗ trợ đa ngôn ngữ, tự động làm sạch văn bản, phân đoạn thông minh và xuất audio chất lượng cao.

---

## 🌟 Tính năng nổi bật

- 🎙️ **Giọng đọc AI tự nhiên**: Tích hợp các mẫu giọng Gemini 3.1 (`Kore`, `Puck`, `Zephyr`, `Fenrir`, `Charon`) với độ biểu cảm cao.
- 🪄 **AI Làm sạch văn bản**: Tự động chuẩn hóa số, ngày tháng, tên riêng, mở rộng viết tắt (VD: *TP.HCM* → *Thành phố Hồ Chí Minh*).
- 🧩 **Chia đoạn thông minh**: Phân đoạn ngữ nghĩa tự động tránh quá giới hạn API và ghép nối lại thành tập tin hoàn chỉnh.
- 🎛️ **Tùy chỉnh sâu**:
  - Tốc độ đọc: `0.5x` đến `2.0x`
  - Cao độ (Pitch): `-20` đến `+20`
  - Âm lượng: `0%` đến `200%`
  - Chế độ đọc: *Tin tức*, *Kể chuyện*, *Giáo viên*, *MC*, *Podcast*, *Thuyết minh*, *Quảng cáo*.
- 🎵 **Trình phát audio sóng âm**: Hiệu ứng Waveform động, phát/dừng, tua thời gian và âm lượng.
- 📥 **Xuất định dạng đa dạng**: MP3, WAV, OGG, AAC, FLAC với bitrate (64-320kbps) và tần số lấy mẫu (22-48kHz).
- 🏗️ **Clean Architecture / Provider Pattern**: Sẵn sàng mở rộng sang ElevenLabs, OpenAI TTS, Google Cloud TTS, Azure, Amazon Polly và WebSpeech Offline.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy Cục bộ

### Yêu cầu hệ thống
- Node.js >= 18
- npm / yarn / pnpm

### Các bước cài đặt:

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường (`.env`)**:
   Tạo file `.env` hoặc cấu hình trong mục Cài đặt trên giao diện:
   ```env
   GEMINI_API_KEY="AIzaSy_YOUR_GEMINI_API_KEY"
   PORT=3000
   ```

3. **Khởi chạy chế độ Development**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 🛠️ Hướng dẫn Triển khai lên Vercel hoặc Render

### 1. Triển khai lên Vercel
1. Đẩy mã nguồn lên GitHub.
2. Kết nối dự án với [Vercel](https://vercel.com).
3. Đặt biến môi trường `GEMINI_API_KEY` trong mục **Environment Variables** của Vercel Project Settings.
4. Vercel sẽ tự động chạy `npm run build` và public ứng dụng.

### 2. Triển khai lên Render hoặc Cloud Run (Docker)
1. Sử dụng file `Dockerfile` có sẵn trong thư mục gốc.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run start` (chạy `node dist/server.cjs` trên port 3000).

---

## 📄 Giấy phép

Được phát triển với Google AI Studio, React 19, Express và TailwindCSS.
