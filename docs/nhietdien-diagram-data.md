# Dữ liệu text cho sơ đồ Nhiệt điện

Đã thay cả 7 hình sơ đồ nguyên khối bằng inline SVG: Tổng quan, Thời gian thực, Lò hơi, Nhiên liệu, Phát thải, Sơ đồ điện/SEU và Digital Twin trong AI. Tên thiết bị, nhãn, số đo, đơn vị và trạng thái đều là SVG `<text>`/`<tspan>`. Đường nối, thanh cái và ký hiệu điện là SVG. Chỉ phần hình minh họa thiết bị dùng ảnh riêng, không chứa nhãn hay số đo.

Các bitmap sơ đồ nguyên khối đã được xóa. Banner nhà máy và logo vẫn dùng ảnh.

## Giá trị ban đầu phía server

- `config/nhietdien-preview-data.js`: model dữ liệu mô phỏng, chia theo loại sơ đồ.
- `routes/nhietdien.js`: truyền `diagramData` vào view. Khi nối dữ liệu thật, thay model mô phỏng bằng dữ liệu của API ở đây.
- `views/nhietdien/partials/diagram.ejs`: bố cục, đơn vị, độ chính xác thập phân và nhãn.
- `public/nhietdien/app.js`: cập nhật text/trạng thái trong sơ đồ đang hiển thị.

## Cập nhật trong trình duyệt

```js
// Dữ liệu số dùng number, không phải chuỗi đã định dạng.
window.NhietDienDiagrams.setData('realtime', {
  totalPowerMw: 905,
  unit1PowerMw: 301.8,
  steamPressureMpa: 18.2,
  unit3State: 'running'
});

// Xem toàn bộ khóa dữ liệu hiện đang có trên sơ đồ.
window.NhietDienDiagrams.getData('realtime');

// Cập nhật nhiều sơ đồ nếu chúng hiện diện trong DOM.
window.NhietDienDiagrams.update({
  fuel: { stockTonnes: 170000, stockDays: 41.2 },
  emissions: { noxOutMgNm3: 138, scrEfficiency: 56.9 }
});

// Điểm nhận payload cho polling hoặc WebSocket.
document.dispatchEvent(new CustomEvent('nhietdien:data', {
  detail: { seu: { unit1PowerMw: 301.8, unit3State: 'running' } }
}));
```

Tên sơ đồ: `overview`, `realtime`, `boiler`, `fuel`, `emissions`, `seu`, `twin`. Chỉ sơ đồ đang có trên trang mới được cập nhật; `getData()` trả `null` nếu sơ đồ không hiện diện. `setData()`/`update()` trả số phần tử DOM đã cập nhật. Cùng một khóa có thể xuất hiện tại nhiều vị trí trên sơ đồ.

Trạng thái hỗ trợ `running`, `stopped`, `warning`; nội dung nhãn và màu đổi cùng nhau. Giá trị số được định dạng `vi-VN`, đơn vị giữ nguyên; độ chính xác do `data-decimals` của trường quyết định. Khóa không tồn tại, dữ liệu sai kiểu và số không hữu hạn bị bỏ qua. Cập nhật chỉ dùng `textContent`, không chèn HTML.

Cơ chế này cập nhật lớp **sơ đồ**; bảng và KPI bên ngoài sơ đồ chưa dùng cùng API này. Hình thiết bị là phần minh họa tĩnh, không thay đổi theo số đo.

## Kiểm chứng

- `node --test tests/nhietdien-diagrams.test.js`: 10/10 đạt; kiểm tra đủ 7 SVG, khóa dữ liệu, thay model phía server, escape text và loại bỏ ảnh nguyên sơ đồ.
- Kiểm tra Chromium: cập nhật mọi khóa hiện diện trong cả 7 sơ đồ, đổi trạng thái, nhận payload qua sự kiện, phục hồi giá trị cũ; đơn vị và hình thiết bị giữ nguyên. Giá trị không hợp lệ không làm đổi dữ liệu.
- Toàn bộ 18 màn hình desktop/mobile tải được, không lỗi JavaScript; mobile cuộn trong khối sơ đồ để giữ chữ đọc được, không làm tràn ngang toàn trang.
