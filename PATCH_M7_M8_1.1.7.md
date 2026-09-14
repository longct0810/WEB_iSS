# Patch EnMS v1.1.7 — M7/M8

Patch áp dụng trực tiếp lên EnMS v1.1.6.

## Nội dung

- Dựng lại M7 Tiết kiệm năng lượng & M&V.
- Dựng lại M8 Phát thải CO₂ & ESG.
- Mở rộng mock/API contract cho M7/M8.
- Cập nhật toolbar và metadata lên v1.1.7.
- Không thay `.env`, database schema, JWT key hoặc HES WebSocket key.

## Sau khi copy patch

```bash
npm install
npm test
pm2 restart smartgrid --update-env
```

Sau đó Ctrl+F5 trình duyệt.
