BẢN VÁ: VIỆT HÓA NỘI DUNG CẢNH BÁO POWERAI
Ngày: 06/08/2026
Không tăng version.

File cập nhật:
1. public/javascripts/dashboard/dashboard.js
   - Thêm hàm powerAITranslateAlertText().
   - Việt hóa tiêu đề cảnh báo trả về từ PowerAI.
   - Áp dụng Việt hóa cho nguyên nhân và khuyến nghị.
   - Hỗ trợ các cảnh báo: Current Unbalance, THD Current High,
     THD Voltage High, Invalid Data, Data Stream Timeout...

2. public/javascripts/socket-data-watchdog.js
   - DATA STREAM TIMEOUT -> MẤT DỮ LIỆU THỜI GIAN THỰC.
   - realtime/server -> thời gian thực/máy chủ.

3. views/Dashboard/dashboard.ejs
   - Đổi tiêu đề cột "Nguyên nhân / Khuyến nghị" thành
     "Chi tiết cảnh báo".

Cách áp dụng:
- Giải nén vào thư mục gốc project iSS và cho phép ghi đè file.
- Khởi động lại Node.js/PM2.
- Trên trình duyệt nhấn Ctrl+F5 để xóa cache JavaScript cũ.
