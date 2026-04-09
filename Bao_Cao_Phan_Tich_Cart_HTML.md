# Báo Cáo Phân Tích Kỹ Thuật: `cart.html`

**Dự án**: K-Pop Music Store
**Mục tiêu**: Phân tích logic quản lý trạng thái hiển thị của Giỏ hàng, tính năng cập nhật số lượng và cơ chế Render chủ động.

---

## 1. Cấu trúc Layout Mặc Định

Trang giỏ hàng sử dụng chung Navbar và Footer từ bộ khung chuẩn tĩnh. 
Vùng `<main>` có thiết kế hết sức đơn giản:
```html
<div class="page-header">
    <h1>Giỏ hàng</h1>
    <div class="breadcrumb-custom"><a href="index.html">Trang chủ</a> / Giỏ hàng</div>
</div>
<div id="cartContent"></div>
```
- Khối DOM `#cartContent` hoàn toàn được khoét rỗng, chờ đợi JavaScript từ Local Storage tiêm dữ liệu vào.
- Cách thiết kế này đi đúng hướng của Single Source of Truth (Một Nguồn Chân Lý duy nhất): Giao diện giỏ hàng không được hard-code bằng HTML, mà phải được sinh ra từ chính trạng thái (State) thực tế lưu trong máy khách hàng.

## 2. Kiến Trúc JavaScript (Mô phỏng Reactivity)

Logic ở thẻ script là một vòng lặp sự kiện tự cập nhật (Self-Updating Render Loop), mang hơi hướng tư duy của React/Vue:

### 2.1 Trạng Thái Giỏ Hàng Trống (Empty State)
```javascript
var items = Cart.getCart();
if (items.length === 0) {
    cartContent.innerHTML = '<div class="empty-state">...<h3>Giỏ hàng trống</h3></div>';
    return;
}
```
Ngay lập tức kiểm tra mảng. Nếu rỗng, hiển thị UX hướng người dùng bấm nút "Mua sắm ngay" quy về lại trang chủ.

### 2.2 Trạng Thái Có Hàng & Hiển Thị Động
Sử dụng hàm `.map().join('')` ghép chuỗi siêu tốc cho từng bản ghi:
1. Bản ghi sản phẩm (`.cart-item`):
   - Chứa thông tin ảnh (`item.cover`), tên bài hát.
   - **Xử lý số lượng (Quantity)**:
     `<button onclick="changeQty('ID', -1)">` và `<button onclick="changeQty('ID', 1)">`.
   - **Nút xóa (Remove)**:
     `<button onclick="removeItem('ID')">`
2. Bảng chốt đơn (`.cart-summary`):
   Sơ kết tự động tổng số món (`Cart.getCartCount()`) và tự quy đổi thành tiền mặt (`Cart.formatPrice(Cart.getCartTotal())`).
   
### 2.3 Cơ chế Binding Các JS Handle Inline
```javascript
window.changeQty = function (id, delta) {
    Cart.updateQuantity(id, delta);
    renderCart();
};

window.removeItem = function (id) {
    Cart.removeFromCart(id);
    renderCart();
    showToast('Giỏ hàng', 'Đã xóa sản phẩm khỏi giỏ hàng.');
};
```
- Lý do dùng `window.xyz`: Do IIFE (Hàm tự gọi) giam giữ mọi biến bên trong không gian ảo, nên viết thẳng `onclick="changeQty()"` trên HTML thẻ DOM sẽ bị trỏ đến khoảng không, sinh lỗi `undefined`. Bằng cách gán `changeQty` thành thuộc tính của cụm Object toàn cục `window`, code HTML Inine có thể vươn tầm tay ra và gọi trúng đích hàm này.
- **Tính Phản Ứng (Re-render)**: Chìa khoá của luồng này nằm ở lệnh **`renderCart();`** đặt ở sát đít mỗi nút chốt chặn thay đổi data (Thêm/Xóa). Thao tác này tương đương lệnh `setState()`. Mỗi khi DB Local thay đổi, nó ra lệnh vẽ lại (Re-paint) toàn bộ khung HTML giỏ hàng để khớp trạng thái mới lập tức. Bù lại việc này, nếu danh sách hàng lên đến cả ngàn items thì browser sẽ giật lag do bị ép phá hủy và dựng lại khung HTML liên tục. Nhưng trong bối cảnh E-commerce Web, thiết kế này hoàn toàn rất hiệu quả và nhẹ bén.
