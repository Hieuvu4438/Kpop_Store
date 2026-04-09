# Báo Cáo Phân Tích Kỹ Thuật: `contact.html`

**Dự án**: K-Pop Music Store
**Mục tiêu**: Đánh giá cấu trúc HTML Form liên hệ tĩnh, phân tích cách thiết lập Bootstrap Grid bất đối xứng và tích hợp UX/UI.

---

## 1. Cấu Trúc Bố Cục Bất Đối Xứng (Asymmetric Grid)

Trang liên hệ áp dụng cơ chế 2 cột theo tỷ lệ của Bootstrap (`row g-4`):
- **Bên Trái (`col-lg-7`)**: Dành toàn bộ diện tích cho Biểu mẫu lấy tin (Form Liên Hệ).
- **Bên Phải (`col-lg-5`)**: Các khối lượng tin tức bị động (Company Info, FAQ, Social Links).

**Lợi thế UX**: Mắt người dùng thường tự động quyét từ trái sang phải theo hình chữ F (F-Pattern layout). Bằng cơ chế đặt Form bên trái kích cỡ to hơn, trang web âm thầm ép đối tượng tham gia tương tác gửi tin nhắn làm ưu tiên số một.

---

## 2. Phần Tử Form Liên Hệ (Contact Form)
```html
<div class="col-lg-7">
    <div class="bento-box">
        <form id="contactForm" onsubmit="...">
```
- Bao bọc toàn Form bên trong `bento-box`, một Custom CSS Class mang yếu tố bo cong mềm mại với Box-Shadow để form trông nổi hẳn lên ở tâm.
- **Input Phân Rã Bằng Lưới (`row g-3`)**: Form tiếp tục sử dụng Grid lồng Grid. Họ, Tên (`col-md-6`) và Email (`col-md-6`) nằm trên cùng 1 hàng vắt ngang tiết kiệm khoảng không màn hình, trong khi các dòng Nhập Nội Dung/Chủ Đề lại bung to chiếm hết tỷ lệ (`col-12`).

### 2.1 CSS Custom Override
Tại đây tác giả từ chối dùng class gốc của Form (`.form-control`) của thư viện Bootstrap mà thay bằng:
- `.form-label-custom`
- `.form-input-custom`

Bộc lộ ý đồ tạo một Style/Thème khác biệt (VD: Ô text viền màu sắc, bo góc vuông/tròn tuỳ hứng, hiệu ứng viền phát sáng Focus).

### 2.2 Client-Form Validation & Event Hook
```html
<form onsubmit="event.preventDefault(); showToast('Liên hệ', 'Cảm ơn bạn! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'); this.reset();">
```
- Các tham số `<input required>` khóa không cho Form gửi đi nếu thiếu chữ. Trình duyệt tự nhả Pop-over bắt lỗi báo đỏ.
- Giống Footer của trang chủ, luồng Form này bị chặn đứng hoàn toàn việc POST lên máy chủ bằng `event.preventDefault()`. Nó sẽ phát tín hiệu Thành Công lừa người dùng thông qua hàm `showToast` bằng HTML và trả input box về trắng tinh (`this.reset()`). Thực tế ở bản demo này không có kết nối cơ sở dữ liệu.

---

## 3. Cụm Bento-Box & FAQ Kèm Theo (Lines 91-158)

Khu vực bên phải gồm 3 khối `bento-box` tách biệt:
1. **Liên Hệ (`bento-box-dark`)**: Tự nghịch đảo màu nền của CSS background sang tông DarkMode để gây chú ý (`color: var(--white)`). Đây là Contrast Mechanism giúp vùng chứa Data Contact không bị hoà trộn với màu trắng phía Form tay trái.
2. **Kênh Follow (Social Links)**: Sử dụng Custom Class bổ trợ `.social-links-lg` bắt FontAwesome Icon phình to hơn so với Footer, tăng Hit-Box bấm ngón tay.
3. **Cẩm nang nhanh (FAQ)**: Các vấn đề cơ bản (MP3 vs FLAC, QR Code) nằm trọn trong 1 khối nhỏ, giúp phòng thủ các thắc mắc vụn vặt và giảm áp lực lên chính tổng đài chăm sóc khách hàng.

---

## 4. Khu Vực Bản Đồ (Map Section)
Giống như `index.html`, Module IFrame nhúng Map xuất hiện nguyên si ở `contact.html` (Lines 162-172) tích hợp tham số hoãn load `loading="lazy"` không gây gánh nặng Render Tree cho Website con.
