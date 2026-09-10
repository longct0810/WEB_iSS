# iSS 1.4.0 - Ollama AI Assistant

## Cấu hình

Sao chép các biến trong `.env.example` vào `.env`:

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
OLLAMA_TIMEOUT_MS=120000
OLLAMA_NUM_CTX=8192
```

## Chuẩn bị Ollama

```bash
systemctl status ollama
ollama pull qwen3:4b
curl http://127.0.0.1:11434/api/tags
```

## Khởi động iSS

```bash
npm install
npm start
```

Hoặc PM2:

```bash
npm run restart:pm2
```

## Kiểm tra

```bash
curl http://localhost:3000/api/ai/health
curl http://localhost:3000/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Sức khỏe thiết bị hiện tại thế nào?","meter_id":"366621"}'
```

Chatbot không truy cập trực tiếp cơ sở dữ liệu. Backend lấy ngữ cảnh từ PowerAI rồi gửi dữ liệu có cấu trúc sang Ollama để diễn giải bằng tiếng Việt.
