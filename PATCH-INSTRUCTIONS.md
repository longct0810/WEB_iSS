# Patch chatbot AI iSS — không tăng version

## 1. Sao chép file
Sao chép các thư mục trong patch vào thư mục gốc frontend iSS:

- `services/ollama-service.js`
- `controllers/ai_chat_controller.js`
- `routes/ai_chat.js`
- `public/css/iss-ai-chatbot.css`
- `public/js/iss-ai-chatbot.js`
- `views/partials/iss-ai-chatbot.ejs`

## 2. Cài dependency

```bash
npm install axios
```

## 3. Gắn router vào Express
Trong file đang khởi tạo `app` (thường là `services/web-server.js`, `app.js` hoặc `index.js`), thêm:

```js
const aiChatRouter = require('../routes/ai_chat');
```

Điều chỉnh `../` theo vị trí file thực tế, sau đó thêm sau middleware JSON:

```js
app.use(express.json({ limit: '100kb' }));
app.use('/api/ai', aiChatRouter);
```

Nếu project đã có `express.json()`, không cần khai báo lần hai.

## 4. Gắn giao diện vào dashboard.ejs
Trong `<head>`:

```ejs
<link rel="stylesheet" href="/css/iss-ai-chatbot.css">
```

Trước thẻ `</body>`:

```ejs
<%- include('../partials/iss-ai-chatbot') %>
<script src="/js/iss-ai-chatbot.js"></script>
```

Điều chỉnh đường dẫn partial theo vị trí `dashboard.ejs`. Nếu dashboard nằm trực tiếp trong `views`, dùng:

```ejs
<%- include('partials/iss-ai-chatbot') %>
```

## 5. Cấu hình .env

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
OLLAMA_TIMEOUT_MS=120000
```

## 6. Chuẩn bị Ollama

```bash
ollama pull qwen3:4b
ollama list
```

## 7. Kiểm tra

```bash
curl http://127.0.0.1:11434/api/tags
curl http://localhost:PORT_I​​SS/api/ai/health
```

Sau đó mở dashboard và bấm nút `AI` phía dưới bên phải.

## 8. Kết nối dữ liệu PowerAI hiện tại
Frontend tự gửi `window.powerAIData` nếu biến này tồn tại. Sau khi load dữ liệu PowerAI, có thể gán:

```js
window.powerAIData = payload;
```

Hoặc định nghĩa ngữ cảnh riêng:

```js
window.getIssAiContext = function () {
  return {
    meterId: window.currentMeterId,
    alerts: window.currentPowerAIAlerts || [],
    health: window.currentPowerAIHealth || null
  };
};
```

Model chỉ diễn giải ngữ cảnh được truyền vào; không được tự truy cập database.
