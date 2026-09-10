# iSS AI Agent 2.0

## Kiến trúc

1. Qwen Planner chuyển câu hỏi thành JSON kế hoạch.
2. Tool Router chỉ cho phép gọi tool trong whitelist.
3. PowerAI Client lấy dữ liệu thật.
4. Qwen Answer Composer diễn giải dữ liệu bằng tiếng Việt.
5. Output Guard chặn toàn bộ reasoning/tiếng Anh trước khi trả về frontend.

## Cấu hình `.env`

```env
QWEN_API_URL=http://127.0.0.1:11434
QWEN_MODEL=qwen3:4b
POWERAI_API_URL=http://127.0.0.1:8080
```

Các biến cũ `OLLAMA_URL`, `OLLAMA_MODEL`, `POWER_AI_URL` vẫn được hỗ trợ nhưng có độ ưu tiên thấp hơn.

## API

- `GET /api/ai/health`
- `GET /api/ai/models`
- `GET /api/ai/tools`
- `POST /api/ai/chat`
- `POST /api/ai/chat/stream`
- `POST /api/ai/reset`

## An toàn

- Qwen không được tự viết SQL hoặc URL.
- Chỉ gọi tool đọc dữ liệu trong whitelist.
- Không trả nội dung reasoning ra frontend.
- Nếu câu trả lời không đạt kiểm tra tiếng Việt, hệ thống tự tạo lại; nếu vẫn lỗi sẽ trả fallback tiếng Việt an toàn.
