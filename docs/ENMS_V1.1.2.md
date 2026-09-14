# EnMS v1.1.2 — M1 Executive Dashboard visual alignment

Phiên bản này tập trung rà soát và hoàn thiện **M1 – Executive Dashboard / Tổng quan điều hành** theo ảnh giao diện chuẩn do người dùng cung cấp, đồng thời giữ nguyên shell hiện có (topbar, sidebar, JWT, WebSocket và route/API nền).

## Phạm vi cập nhật M1

- Tiêu đề M1 và mô tả theo đúng dashboard điều hành.
- Thanh lọc: Nhà máy, Thời gian, So sánh với, Xuất báo cáo.
- 6 KPI điều hành: điện năng, nhiên liệu, chi phí, CO₂e, EnPI và tỷ lệ hoàn thành mục tiêu.
- Hero nhà máy với thông tin: công suất thiết kế, sản phẩm, số trạm, số điểm đo, nguồn năng lượng, thời điểm vận hành.
- Khối **Sản lượng & EnPI** với 4 chế độ xem.
- **Cơ cấu tiêu thụ năng lượng** theo loại năng lượng hoặc khu vực.
- **Xu hướng tiêu thụ năng lượng** theo Điện / Than / Hơi / Nhiệt / Tổng quy đổi.
- Bảng **Hiệu suất theo khu vực (EnPI)**.
- Cảnh báo / sự kiện nổi bật.
- Tiến độ mục tiêu năng lượng năm 2025.
- Chỉ số tài chính & môi trường lũy kế năm.

## Contract API mock M1

`GET /api/enms/v1/modules/overview` bổ sung các khối:

```text
kpis[6]
plant
production
energyMix
energyTrend
efficiency
alertHighlights
targets
impacts
```

Các contract cũ `primary`, `secondary`, `table`, `insights` vẫn được giữ để tương thích với các thành phần dùng chung.

## Không thay đổi

- PostgreSQL schema / biến `DB_*`.
- Login JWT.
- HES WebSocket ticket, subprotocol `hes104-v1`, ACL và `SUBSCRIBE`.
- Route `/api/enms/v1/*`.
- Các màn hình M2–M17 chưa được thay đổi nghiệp vụ trong phiên bản này.

## Preview

```bash
npm install
npm run preview:enms
```

Mở:

```text
http://127.0.0.1:3100/enms/preview/overview
```
