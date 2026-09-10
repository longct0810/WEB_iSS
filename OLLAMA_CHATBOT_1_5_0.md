# Ollama Chatbot v1.5.0

## Cấu hình

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
```

Chatbot gọi endpoint streaming `/api/ai/chat/stream`. Qwen3 được yêu cầu `/no_think`, backend bỏ qua trường `message.thinking`, và frontend chỉ render nội dung trả lời cuối cùng.

Sau khi cập nhật:

```bash
npm install
npm run restart:pm2
```

Nhấn `Ctrl + F5` để xóa cache JS/CSS cũ.
