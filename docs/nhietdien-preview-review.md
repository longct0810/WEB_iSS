# Rà soát preview Nhiệt điện — 12/10/2026

Đối chiếu lần lượt 18 JPG trong `preview-nhietdien.zip`, tương ứng 17 trang và hai màn hình AI. Tất cả trang được chỉnh vì đánh giá ban đầu dưới ngưỡng yêu cầu 85%.

Các mức dưới đây là **ước lượng thị giác**, có tính chủ quan, không phải tỷ lệ pixel trùng nhau. Căn cứ: bố cục và vị trí khối (35%), biểu đồ/sơ đồ (25%), đủ thành phần hiển thị (20%), chữ và màu sắc (20%). Đồng hồ và ngày của dữ liệu mô phỏng có thể thay đổi.

| Ảnh | Trang | Trước | Sau | Điều chỉnh |
| --- | --- | --- | --- | --- |
| 1 | Giám sát thời gian thực | ~68% | ~92% | Khôi phục sơ đồ công nghệ; cân lại bảng tổ máy, điện tự dùng và hai hàng biểu đồ. |
| 2 | Hiệu suất, EnPI và EnB | ~72% | ~89% | Đổi biểu đồ đường/cột đơn thành cột nhóm; bổ sung trục, điểm và nhãn cuối; cân ba bảng cuối. |
| 3 | Nhiên liệu và hệ thống than | ~70% | ~92% | Dùng sơ đồ công nghệ than đúng chi tiết; sửa tỷ lệ khối nhiên liệu khác; thêm trục và nhãn cho ba biểu đồ. |
| 4 | Lò hơi, Turbine và hệ thống hơi | ~68% | ~91% | Khôi phục sơ đồ hơi của bốn tổ máy; chỉnh chiều cao các hàng, biểu đồ và bảng cuối. |
| 5 | Phát thải và môi trường | ~63% | ~90% | Khôi phục chuỗi lò–SCR–ESP–FGD; đặt hai bảng thông số bên phải; đưa CEMS và sự kiện vào cùng màn hình. |
| 6 | Sơ đồ điện, điện tự dùng và SEU | ~65% | ~91% | Khôi phục sơ đồ điện 220 kV và nhánh tự dùng; cân ba bảng giữa và bốn khối cuối. |
| 7 | Tổng quan nhà máy | ~73% | ~92% | Khôi phục sơ đồ công nghệ; đưa bộ lọc lên banner; cân tỷ lệ tổ máy, điện tự dùng, tồn kho và kế hoạch. |
| 8 | Báo cáo | ~77% | ~88% | Cân các hàng KPI, ba biểu đồ, bảng/donut và phần báo cáo cuối; giữ đầy đủ nội dung trong một viewport. |
| 9 | Quản lý dữ liệu | ~62% | ~89% | Bỏ tiêu đề lặp; tăng donut; bổ sung đủ 10 điểm đo; đặt lịch sử và cảnh báo dưới hai bảng cài đặt bên phải. |
| 10 | Cảnh báo và sự kiện | ~64% | ~89% | Đổi sang cột chồng theo giờ, donut sáu khu vực và bảy loại cảnh báo; bổ sung tám sự kiện và bảng chi tiết. |
| 11 | Mục tiêu năng lượng | ~66% | ~89% | Biểu đồ cột kèm mục tiêu/baseline; bổ sung 10 chỉ tiêu; đưa tuân thủ xuống dưới bảng, roadmap dưới hành động. |
| 12 | Cơ hội tiết kiệm năng lượng | ~77% | ~87% | Bỏ tiêu đề lặp; chỉnh KPI có biểu tượng, ba biểu đồ, bảng cơ hội và hai khối phân tích bên phải. |
| 13 | Kế hoạch thực hiện | ~63% | ~89% | Bổ sung 12 tháng, sáu thanh tiến độ, tám kế hoạch, donut ngân sách, cột mốc, rủi ro và kết quả kỳ vọng. |
| 14 | Phân tích nâng cao AI — Tổng quan | ~76% | ~87% | Cân ba biểu đồ và ba bảng phân tích; chỉnh KPI, cỡ chữ, hàng mô hình và hiệu quả cuối. |
| 15 | Phân tích nâng cao AI — Dự báo | ~35% | ~89% | Bổ sung màn hình riêng: dự báo có khoảng tin cậy, scatter bất thường, nguyên nhân gốc, khuyến nghị, mô phỏng, Digital Twin. |
| 16 | Tối ưu vận hành | ~72% | ~88% | Bỏ tiêu đề lặp; cân biểu đồ cột ghép, phụ tải, bảng giải pháp, tiến độ và hiệu quả; loại tràn cuối trang. |
| 17 | Quản trị hệ thống | ~75% | ~87% | Bỏ tiêu đề lặp; tăng donut người dùng; cân dịch vụ, tài nguyên, người dùng, phân quyền và nhật ký. |
| 18 | Cài đặt hệ thống | ~61% | ~89% | Bỏ tiêu đề lặp; căn ba hàng cài đặt; bổ sung người dùng và ngưỡng PF; gộp IP/cổng; giữ sao lưu trong màn hình. |

## Thay đổi chung

- Banner ảnh nhà máy, logo và biểu tượng; thanh bên 211 px; cỡ chữ, khoảng cách và màu nền theo ảnh mẫu.
- Loại tiêu đề lặp, cân các hàng nội dung ở 1672 × 941; giữ bố cục đọc được ở 390 px.
- Sơ đồ công nghệ dùng inline SVG. Tất cả nhãn/chỉ số/trạng thái là text; chỉ minh họa thiết bị được cắt riêng từ ảnh mẫu. Ảnh nguyên sơ đồ đã bị xóa. Chi tiết tích hợp trong `docs/nhietdien-diagram-data.md`.
- Biểu đồ SVG dùng partial `views/nhietdien/partials/chart.ejs`; các bảng vẫn là HTML.
- AI có hai chế độ: `/nhietdien/preview/ai` và `/nhietdien/preview/ai?view=predictive`.

## Kiểm chứng

- Chromium: 18 màn hình × desktop/mobile = 36 lượt; tất cả HTTP 200, không lỗi JavaScript, mọi ảnh tải đủ.
- Desktop: chiều rộng 1672 px, chiều cao nội dung không vượt 941 px. Mobile: chiều rộng trang không vượt 390 px, cuộn dọc tự nhiên.
- Chuyển chế độ AI qua liên kết thành công. Trang không tồn tại trả 404.
- `node --check routes/nhietdien.js` và `git diff --check`: đạt.
- `npm test`: **72/74 đạt**. Hai lỗi `advanced module renderer dùng component dùng chung thay vì nhân bản code` và `core và component dùng chung đã được tách khỏi app.js nguyên khối` tái hiện khi chạy trên bản HEAD trước chỉnh sửa; nằm trong `tests/enms_modular.test.js`.
- Đã khởi động lại riêng preview Nhiệt điện trên cổng **6582** để nạp route mới.

## Bộ ảnh đối chiếu

Đã lưu ảnh mẫu, trước/sau và mobile cho từng màn hình trong `/tmp/nhietdien-review/`. Mở `index.html` để chọn trang và đối chiếu; file `verification.json` chứa kích thước, mã HTTP và kiểm tra tài nguyên. Bản nén: `/tmp/nhietdien-review.zip`.

Đây vẫn là preview dùng dữ liệu mô phỏng. Các nút nhập liệu/xuất báo cáo không được nối thêm tới hệ thống vận hành trong lần chỉnh giao diện này.

## Điều chỉnh theo phản hồi về text

Đã thay 7 bitmap sơ đồ bằng SVG text có khóa dữ liệu, bổ sung model giá trị ban đầu và API cập nhật phía trình duyệt. Không còn chữ/chỉ số nằm trong ảnh sơ đồ. Đã kiểm tra thay đổi số đo/trạng thái trên tất cả 7 sơ đồ và chạy 10 test riêng, đều đạt. Xem `docs/nhietdien-diagram-data.md` để nối API/WebSocket.

Các mức phần trăm ở bảng đầu là đánh giá thị giác của đợt rà soát đầu; chưa đo lại bằng pixel sau khi thay sơ đồ sang SVG text.
