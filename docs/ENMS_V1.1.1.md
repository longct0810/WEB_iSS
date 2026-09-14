# EnMS v1.1.1 – ApexCharts Rendering Hotfix

## Phạm vi

v1.1.1 là hotfix trực tiếp từ v1.1.0. Không thay đổi chức năng nghiệp vụ, API contract, database schema, login JWT hay HES WebSocket authentication.

## Lỗi được sửa

M8 – `Phát thải CO₂ & ESG` có thể dừng render và hiển thị:

```text
Cannot read properties of undefined (reading 'bar')
```

Shared renderer `public/enms/js/components/module-page.js` trước đây luôn tạo thuộc tính `plotOptions`; với biểu đồ không phải `bar`, giá trị được đặt thành `undefined`. ApexCharts 3.x có các nhánh nội bộ truy cập `config.plotOptions.bar`, vì vậy explicit `undefined` có thể phá vỡ default options sau quá trình merge.

## Thay đổi

- Chỉ gắn `options.plotOptions.bar` khi `panel.kind === 'bar'`.
- `public/enms/js/core/charts.js` loại bỏ top-level option có giá trị `undefined` trước khi tạo cấu hình ApexCharts.
- Thêm `tests/enms_chart_regression.test.js`.
- Version: `1.1.1`.

## Ảnh hưởng

Hotfix áp dụng cho shared module dashboard, do đó bảo vệ toàn bộ các module dùng `module-page.js`, bao gồm M3, M5, M7, M8 và M11–M17. Không cần migration database.

## Nâng cấp

Giữ nguyên `.env`, key JWT và RSA hiện tại, thay source bằng v1.1.1 rồi chạy:

```bash
npm install
npm test
npm start
```

Nếu chạy PM2:

```bash
npm install
npm test
npm run restart:pm2
```
