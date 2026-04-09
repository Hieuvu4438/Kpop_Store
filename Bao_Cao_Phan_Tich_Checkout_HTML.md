# Báo Cáo Phân Tích Kỹ Thuật: `checkout.html`

**Dự án**: K-Pop Music Store
**Mục tiêu**: Phân tích kiến trúc tách rời Controller (Code logic) khỏi View (HTML DOM) tại trang Thanh toán cuối.

---

## 1. Sự Giải Phóng Hoàn Toàn Giao Diện (Null UI DOM)

Khi bóc tách `checkout.html`, có thể thấy dung lượng file vô cùng nhẹ (chưa tới 70 line code), vì HTML chỉ đóng đúng vai trò cái phễu hứng:
```html
<main>
    <div class="container">
        ...
        <div id="checkoutContent"></div>
    </div>
</main>
```
Trái ngược với file Cart đổ vòng lặp JS nhúng tay lên `<script>`, với `checkout.html`, mọi logic vẽ giao diện form nhập tên tuổi, số tiền thẻ tín dụng, in mã QR Code... đã được "trục xuất" hoàn toàn sang 1 file Controller độc lập là `js/checkout.js`.

**Ưu điểm kiến trúc thuật toán MVC Client-Side này:**
- **Code Clean**: Tách phần lớn rủi ro gây nhiễu mã Javascript ra khỏi HTML thuần. Đảm bảo file tĩnh an toàn.
- **Dễ bảo trì**: Nếu quy trình thay cổng thanh toán ngân hàng (Ví dụ không dùng MoMo nữa mà cài VNPAY), lập trình viên sẽ thao tác trọn vẹn ở `checkout.js` mà không được phép chạm móng tay vào `checkout.html`.

---

## 2. Kỹ thuật Loading Barrier (Màng lụa chắn thao tác) (Lines 48-52)
```html
<!-- Lớp phủ chặn thao tác giúp tránh bấm xác nhận trùng trong lúc chờ hoàn tất -->
<div class="loading-overlay" id="loadingOverlay" style="display: none">
    <div class="spinner"></div>
    <p>Đang xác nhận giao dịch...</p>
</div>
```
Một trong những rủi ro tử thần của E-commerce Website (Thương mại điện tử) xảy ra lỗi "Trùng Lặp API Thanh Toán" (Duplicate Transaction). 
- **Bản chất lỗi**: Chờ mạng chậm, người mua bấm liên tục vào nút "Thanh toán ngay" 5-6 lần -> Server nhận lệnh trừ tiền bằng thẻ tín dụng 6 phát liên tiếp.
- **Tiêm chủng phòng thủ code**: Component UX `loading-overlay`. Cơ chế hoạt động là khi người mua nhấn "Thanh toán" lần đầu tiên, file `checkout.js` sẽ lùa lệnh mở thuộc tính `display: flex;` cho `#loadingOverlay`. 
- Nó lập tức trải ra 1 tấm lụa màu mờ trên **toàn bộ màn hình hiển thị** `position: fixed` che kín mọi nẻo đường, trói tay người dùng không cho phép click vào bất kỳ Link hay nút Button nào nữa, kèm theo cục `spinner` xoay tròn trấn an tâm lý. Sau đó dùng Timeout hoặc Promise chạy 2-3 giây gọi API, xong xuôi mới đá người mua qua trang kết quả `success.html`. 

Đây là kỹ năng code Front-end trình độ bảo mật Senior.

---

## 3. Hệ thống nạp Modules (Scripts)
```html
<script src="js/cart.js"></script>
<script src="js/checkout.js"></script>
<script src="js/chat.js"></script>
```
Đường dẫn Dependency Map: Buộc phải Load `cart.js` TRƯỚC `checkout.js`. Bởi vì khi xử lý thanh toán, Controller sẽ gọi các hàm như `Cart.getCartTotal()` từ Local Storage. Do JS diễn dịch tuần tự từng file, nếu ném checkout lên đầu thì lập tức văng `Reference Error is undefined` và đánh sập quy trình. Tác giả đã tuân thủ vòng đời này rất hoàn mỹ.
