# iSS PowerAI v1.6.0 — Qwen Tool Calling

Chatbot được nâng cấp thành ba lớp:

1. Intent Planner: Qwen chuyển câu hỏi thành JSON kế hoạch.
2. Tool Executor: Node.js chỉ gọi các tool nằm trong whitelist.
3. Answer Composer: Qwen diễn giải dữ liệu thật bằng tiếng Việt.

## Tool đọc dữ liệu hiện có

- get_device_health
- get_active_alerts
- get_alert_history
- get_device_forecast
- get_powerai_status
- get_model_drift

API kiểm tra danh mục tool:

```http
GET /api/ai/tools
```

Chatbot không được tự viết SQL, tự tạo URL hoặc điều khiển thiết bị.
