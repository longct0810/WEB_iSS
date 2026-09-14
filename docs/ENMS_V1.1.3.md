# EnMS v1.1.3 — M2 Realtime visual alignment

## Phạm vi

v1.1.3 chỉ rà soát và hoàn thiện **M2 – Giám sát thời gian thực** theo ảnh giao diện chuẩn người dùng cung cấp. Shell EnMS, M1 và M3–M17 không thay đổi nghiệp vụ.

## Bố cục M2

1. 6 KPI realtime: công suất điện, nhiệt, than, nước, CO₂, chi phí năng lượng.
2. Thanh chế độ năng lượng: Sơ đồ tổng thể, Điện, Nhiệt, Hơi, Nước, Năng lượng tái tạo, Tùy chỉnh; kèm trạng thái Bình thường/Cảnh báo/Sự cố.
3. Sơ đồ luồng năng lượng nhà máy với nguồn đầu vào, công đoạn sản xuất, thành phẩm và hệ thống phụ trợ.
4. Biểu đồ công suất tổng realtime theo 24h/8h/4h.
5. Biểu đồ sản lượng theo ca Hôm nay/Hôm qua.
6. Danh sách 16 trạm điện có tìm kiếm/lọc trạng thái.
7. Bảng thông số Hơi/Than/Nước/Khí nén/Môi trường.
8. Bảng cảnh báo realtime và shortcut sang lịch sử dữ liệu, báo cáo, cấu hình cảnh báo.

## Contract API mock

`GET /api/enms/v1/modules/realtime` bổ sung:

```text
kpis
systemStatus
flow.sources
flow.processes
flow.product
flow.utilities
flow.lines
realtimeTrend
shiftProduction
stations
parameters
realtimeAlerts
```

Các field tương thích cũ `primary`, `secondary`, `table`, `insights` vẫn được giữ.

## Realtime security

Không thay đổi trust boundary:

- Login JWT dùng cơ chế hiện tại.
- API EnMS yêu cầu Bearer JWT.
- HES WebSocket vẫn xin ticket qua `/api/hes/ws-ticket`.
- Subprotocol `hes104-v1`, device ACL và `SUBSCRIBE` giữ nguyên.
- Mock device ID không được gửi sang HES.

## Phiên bản

Package, API metadata, frontend VERSION và sidebar: `1.1.3`.
