# Brainstorming: Website Booking Sầu Riêng Ri6 Độc Quyền

Dự án này hướng tới xây dựng một website quảng bá và đặt trước (booking) sầu riêng Ri6 cao cấp. Mô hình tối giản tập trung vào chất lượng sản phẩm (chỉ bán duy nhất 1 loại sầu riêng) và trải nghiệm đặt hàng tiện lợi cho khách hàng cùng trang quản trị hiệu quả cho Admin.

---

## 1. Tầm Nhìn Sản Phẩm (Product Vision)
* **Sản phẩm duy nhất:** Sầu riêng Ri6 cơm vàng hạt lép, thơm ngon, chuẩn chất lượng.
* **Mục tiêu website:** 
  - Khách hàng: Hiểu rõ về giá trị sầu riêng Ri6 của cửa hàng, dễ dàng đặt lịch hẹn nhận sầu riêng tươi ngon nhất.
  - Admin: Theo dõi thông tin khách đặt hàng (booking) theo thời gian thực để chủ động liên hệ, ship hàng hoặc chuẩn bị.

---

## 2. Phân Tích Đối Tượng Người Dùng & Vai Trò (User Roles)

### A. Khách Hàng (Customer)
* **Hành vi:** Truy cập web, xem thông tin quảng cáo hấp dẫn về sầu riêng Ri6, xem giá cả rõ ràng, điền form đặt trước và chọn thời gian nhận hàng.
* **Yêu cầu cốt lõi:**
  - Giao diện đẹp mắt, khơi gợi cảm giác ngon miệng (hình ảnh sắc nét, màu sắc tươi sáng/sang trọng).
  - Form đặt hàng cực kỳ đơn giản (không bắt buộc đăng ký tài khoản phức tạp, chỉ cần SĐT và thông tin giao hàng).
  - Nhận được phản hồi/xác nhận đặt hàng nhanh chóng.

### B. Quản Trị Viên (Admin)
* **Hành vi:** Đăng nhập vào trang quản trị (Dashboard) để kiểm tra danh sách khách đặt sầu riêng, gọi điện xác nhận, cập nhật trạng thái đơn hàng.
* **Yêu cầu cốt lõi:**
  - Danh sách đơn hàng trực quan, lọc được đơn mới/đã xử lý.
  - Xem nhanh thông tin liên hệ của khách (Tên, Số điện thoại, Địa chỉ, Ghi chú đặc biệt).
  - Báo cáo số lượng sầu riêng đã được book để cân đối lượng hàng nhập về.

---

## 3. Các Tính Năng Cốt Lõi (Core Features)

### 📌 Trang Chủ & Giới Thiệu (Landing Page)
* **Banner Quảng Cáo:** Hình ảnh sầu riêng Ri6 chín vàng, múi dày cơm. Tiêu đề ấn tượng về chất lượng sản phẩm.
* **Thông Tin Sầu Riêng Ri6:** Nguồn gốc, đặc điểm (cơm vàng cơm ráo, vị ngọt béo đậm đà, hạt lép), tại sao nên chọn mua ở đây.
* **Giá Bán:** Hiển thị giá niêm yết (ví dụ: theo kg hoặc theo quả) rõ ràng, cập nhật theo ngày nếu có biến động.
* **Nút Call to Action (CTA):** Nút "Đặt Lịch Nhận Sầu Riêng" nổi bật ở nhiều vị trí để dẫn khách xuống Form đặt hàng.

### 📌 Form Booking (Đặt Lịch Nhận Hàng)
* **Thông tin yêu cầu:**
  - Họ và Tên khách hàng.
  - Số điện thoại liên hệ (bắt buộc để Admin gọi điện xác nhận).
  - Địa chỉ giao hàng (hoặc chọn "Nhận tại cửa hàng").
  - Phân loại đặt: Số lượng (theo Kg hoặc theo Quả).
  - Ngày & Giờ muốn nhận sầu riêng.
  - Ghi chú thêm (ví dụ: "chọn quả chín ăn ngay", "quả chín gối đầu", v.v.).
* **Trải nghiệm:** Tích hợp bộ chọn ngày/giờ thân thiện, tự động tính toán tổng tiền tạm tính dựa trên số lượng khách chọn.

### 📌 Admin Dashboard (Trang Quản Trị)
* **Thống kê nhanh (Widgets):**
  - Tổng số booking mới trong ngày.
  - Tổng khối lượng sầu riêng khách đã đặt trước (để chuẩn bị nguồn cung).
* **Quản lý danh sách Booking:**
  - Bảng dữ liệu hiển thị: ID, Tên Khách, SĐT, Số lượng, Thời gian nhận, Trạng thái (Chờ xác nhận / Đã xác nhận / Đã giao / Đã hủy).
  - Chức năng lọc theo Trạng thái hoặc tìm kiếm theo Số điện thoại.
  - Nút thay đổi trạng thái nhanh hoặc xem chi tiết từng booking.
* **Quản lý Cấu hình (tùy chọn):** Thay đổi giá bán hiển thị trên trang chủ, cập nhật trạng thái kho hàng (Còn hàng / Tạm hết hàng).

---

## 4. Đề Xuất Giải Pháp Công Nghệ (Technical Proposals)

Để tối ưu hóa tốc độ tải trang, giao diện hiện đại và tính bảo mật cho trang quản trị, chúng tôi đề xuất:

* **Frontend:** **Next.js (React) + Tailwind CSS** (đem lại hiệu năng SEO cực tốt cho Landing page và dễ dàng tích hợp Admin Dashboard trên cùng 1 project).
* **UI Components:** **shadcn/ui** hoặc **Vanilla CSS** được tùy biến mượt mà, áp dụng **Glassmorphism** và các chuyển động micro-animation để trang web sầu riêng trông cực kỳ cao cấp và ngon mắt.
* **Backend & Database:** 
  - Đơn giản nhất: Sử dụng **Next.js API Routes** kết hợp với một cơ sở dữ liệu nhẹ như **SQLite (qua Prisma ORM)** hoặc **MongoDB / PostgreSQL**.
  - Nếu muốn không cần duy trì server database phức tạp, có thể sử dụng các dịch vụ Cloud DB miễn phí/giá rẻ như **Supabase** hoặc **Firebase**.

---

## 5. Câu Hỏi Thảo Luận & Tối Ưu (Open Questions)

Để chuẩn bị cho bước tiếp theo (viết PRD - Tài liệu yêu cầu sản phẩm), chúng ta cần thống nhất một số điểm sau:
1. **Phương thức thanh toán:** Khách đặt xong sẽ trả tiền mặt khi nhận hàng (COD) và Admin liên hệ qua điện thoại, hay bạn có muốn tích hợp chuyển khoản ngân hàng qua mã QR (VietQR) tự động không?
2. **Thông báo đơn hàng:** Admin có cần nhận thông báo qua Telegram/Zalo khi có khách đặt đơn mới ngay lập tức không?
3. **Hình ảnh sản phẩm:** Bạn đã có sẵn hình ảnh sầu riêng Ri6 thật của mình chưa, hay cần tôi hỗ trợ tạo hình ảnh AI minh họa cực nét cho giao diện web?
