# Báo Cáo Phân Tích Kỹ Thuật Chuyên Sâu: `product.html`

**Dự án**: K-Pop Music Store (Bootstrap Commercial)
**Mục tiêu**: Bóc tách kỹ thuật và giải thích chi tiết cấu trúc HTML, sự tối ưu UI/UX, cũng như logic JavaScript chịu trách nhiệm nạp và hiển thị (Client-Side Rendering) chi tiết sản phẩm.

---

## 1. Phần Đầu Trang & Tái Sử Dụng Thành Phần (Lines 1-36)

- Khu vực `<head>` và Navbar `<nav>` ở `product.html` gần như kết thừa 100% từ `index.html`. 
- **Dụng ý UI/UX**: Việc giữ nguyên một thanh điều hướng cố định (`sticky-top`) cho toàn bộ các trang (Trang chủ, Sản phẩm, Giỏ hàng) là nguyên tắc "Tính Nết Quán" (Consistency). Khách hàng không bao giờ bị "mất phương hướng" dù họ đang ở bất kỳ độ sâu nào của kênh mua sắm, quan trọng nhất là nút Xem Giỏ Hàng (`#cartBadge`) luôn hiện diện.

---

## 2. Khu Vực Nội Dung Chính (`<main>`)

### 2.1 Điều hướng theo Vết Bánh Mì (Breadcrumbs) (Lines 40-44)
```html
<div class="breadcrumb-custom">
    <a href="index.html">Trang chủ</a> / <span id="breadcrumbTitle">...</span>
</div>
```
- **Chuẩn SEO & UX**: Breadcrumb giúp người dùng biết mình đang ở đâu và cho phép họ quay lại tầng trước đó chỉ với 1 click. 
- **Mapping Dữ liệu**: Thẻ `<span>` được cấp thẻ `id="breadcrumbTitle"`. Mã hiển thị mặc định là bấu chấm `...` vì HTML gốc không hề biết bạn bấm vào bài hát nào. Việc này sẽ được JavaScript giải quyết.

### 2.2 Bộ Khung Render Thông Tin Sản Phẩm (Lines 46-48)
```html
<div class="row g-4 product-detail" id="productDetail">
    <!-- Được render bằng JS -->
</div>
```
- Sử dụng lưới (Grid system - `row g-4`) để tách vùng bố cục (Image bên trái, Thông tin bên phải). Tuy nhiên mã nguồn HTML được **làm trống hoàn toàn**. Mọi tag HTML phục vụ chi tiết (tên giá, format, nút button) sẽ được bơm vào vùng này từ Client Side.

### 2.3 Khu Vực Sản Phẩm Liên Quan (Lines 50-56)
```html
<section class="related-products mt-5" id="relatedProducts" style="display: none;">
    <h2 class="section-title"><i class="fas fa-headphones"></i> Sản phẩm liên quan</h2>
    <div class="product-grid" id="relatedGrid"></div>
</section>
```
- Khu vực hiển thị có ID `#relatedProducts` đi kèm style cứng `display: none` để **ẩn triệt để** khối này ở cấp DOM. 
- **Lý do**: Nếu 1 bài hát (Ví dụ của ca sỹ đó) không có bài hát nào khác ngoài nó, việc giữ lại tiêu đề "Sản phẩm liên quan" mà bên dưới lại trống trơn (blank grid) trông rất "Thiếu chuyên nghiệp". 
- ID `#relatedGrid` là nơi sẽ dán (append) các component thẻ Bài hát được gen ra từ JS.

---

## 3. Hệ Thống Vi Xử Lý JS Tích Hợp (Inline Scripts) (Lines 98-172)

Phần đáng giá nhất của trang `product.html` nằm ở đoạn script IIFE xử lý quá trình nạp - hiển thị thông tin bài hát ngay tại trình duyệt client.

### 3.1 Bóc tách dữ liệu từ URL Parameter
```javascript
var params = new URLSearchParams(window.location.search);
var productId = params.get('id');
```
Đây là kỹ năng "Đọc Route truyền thống". Ví dụ URL khách hàng bấm là `product.html?id=bts1`, API native của trình duyệt `URLSearchParams` sẽ bắt lấy cụm biến sau dấu `?` và bóc tách ra được giá trị chuỗi thuần là `"bts1"`.

### 3.2 Luồng Xử Lý Lỗi Cơ Bản (Validation & Error Handling)
```javascript
if (!productId) {
    document.getElementById('productDetail').innerHTML = 
        '... Không tìm thấy sản phẩm ...';
    return;
}
```
- Check-gate (Cửa kiểm tra) đầu tiên. Đề phòng ai đó chỉ gõ `/product.html` mồ côi (không có ?id). Thay vì sập trang (crash code), DOM `#productDetail` sẽ tự in ra giao diện 404 (Empty State) và dùng lệnh `return;` để khoá (ngắt) hoàn toàn đoạn code phía sau.

### 3.3 Gọi Dữ Liệu Xuyên Không (Fetch API) & Render Main Product
```javascript
fetch('data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (products) {
        var product = products.find(function (p) { return p.id === productId; });
        ...
```
Luồng Fetch này hoạt động như một CSDL ảo (Mock Backend). 
- `array.find()` đối chiếu cái `productId` khách hàng truyền vào với chuỗi ID nằm trong file JSON.
- **Micro-SEO Binding**: 
  ```javascript
  document.title = product.title + ' - ' + product.artist + ' | K-Pop Store';
  document.getElementById('breadcrumbTitle').textContent = product.title;
  ```
  JavaScript can thiệp tự động đổi tên Thẻ Tab Trình Duyệt (`<title>`) ngay sau vài milli-giây.
- Quá trình Render `#productDetail` sử dụng chuỗi nhúng (String Builder) thông qua các biến chia Bootstrap thành hai cột (`col-md-6`), nối chuỗi giá tiền (`Cart.formatPrice`), sử dụng hàm mảng `map()` + `join('')` để chạy vòng lặp in ra toàn bộ tag của các định dạng `.detail-formats`.
- **Gắn Logic Shopping**: Ngay sau khi tiêm HTML xuống DOM, `getElementById('addToCartBtn').addEventListener('click', ...)` bấu luôn vào nút Vừa-Mới-Sinh-Ra để gọi hàm `Cart.addToCart()`.

### 3.4 Thuật Toán Sinh Sản Phẩm Liên Quan (Recommendation Engine)
```javascript
var related = products.filter(function (p) {
    return p.artist === product.artist && p.id !== product.id;
});
if (related.length > 0) { ... }
```
Dù chỉ là logic mặt tiền Client, nhưng tác giả code khá sắc nét:
- Trích xuất toàn bộ kho JSON, bọc thuật toán `filter` với điều kiện Gộp: `p.artist === product.artist` (Bài hát đó CÙNG Ca sĩ) AND `p.id !== product.id` (Phải TRỪ bài hát hiện tại mình đang coi).
- Nếu phát hiện danh sách lọc được lớn hơn 0 (`related.length > 0`). Gọi class thay đổi DOM `style.display = 'block'` mở nắp cho khối Container chứa tiêu đề "Sản phẩm liên quan".
- Một lần trượt dây chuyền `innerHTML = related.map(...).join('')` để đẻ ra hàng loạt Card nhạc số và cắm xuống `#relatedGrid`.

---

## 4. Tổng Kết File `product.html`
Trong khi `index.html` nặng nề về trình bày và layout, `product.html` lại là một trang mang nặng tính **Lập Trình Hàm (Functional UI Pattern)** và xử lý dữ liệu động:
- Hiển thị UI dựa trên tính lệ thuộc vào Param URL (URL Driven). Chú ý không giấu thông tin ở Local Storage hay Session mà đặt thẳng lên thanh URL để thuận người dùng Copy link gửi cho bạn bè (Sharing UX).
- Kiến trúc xử lý luồng sự kiện rất chặt chẽ: Cảnh cáo Empty URL > Fetch HTTP > Lọc JSON > Can thiệp tiêu đề Meta Text > Trải layout chính thức > Bắt sự kiện Click nút Mua > Thuật toán Đề xuất sản phẩm. Mọi thứ được gói kín trong 1 IIFE ngắn nhưng rất uy lực.
