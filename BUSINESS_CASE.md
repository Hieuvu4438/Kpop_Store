### 1. Phân hệ Khách hàng (Storefront - Front-end HTML/CSS/JS)

* **Khám phá và Duyệt sản phẩm K-Pop:**
    * **Load dữ liệu sản phẩm:** Dùng JavaScript (Fetch API) để đọc danh sách các album/bài hát số từ một file `products.json` tĩnh.
    * **Lọc và Tìm kiếm:** Dùng JS thuần để filter theo tên nghệ sĩ, nhóm nhạc (BlackPink, BTS, NewJeans...), hoặc lọc theo thể loại. Mọi thao tác diễn ra ngay lập tức trên trình duyệt.

* **Nhúng bản đồ (Google Maps):**
    * Dùng thẻ iframe của Google Maps Embed dán trực tiếp vào HTML để hiển thị địa chỉ cửa hàng (nếu có bán kèm merchandise offline) hoặc trụ sở ảo của shop.

* **Flow nghiệp vụ Giỏ hàng (Cart Flow):**
    * **Thêm sản phẩm:** Khi khách bấm "Thêm vào giỏ", JavaScript sẽ lưu thông tin bài hát/album đó vào bộ nhớ trình duyệt (`localStorage`).
    * **Thông báo (Feedback):** Ngay lập tức hiển thị một popup/toast notification nhỏ góc màn hình báo "Đã thêm [Tên bài hát] vào giỏ hàng thành công!".
    * **Cập nhật UI (Cart ++):** Số lượng (badge) trên icon giỏ hàng ở thanh menu (Header) sẽ tự động cộng lên (++) mà không cần tải lại trang. Giỏ hàng sẽ không bị mất kể cả khi khách F5 hoặc tắt web mở lại.

* **Flow nghiệp vụ Thanh toán Nhạc số (Checkout Flow):**
    * **Kiểm tra giỏ hàng:** Khách vào trang giỏ hàng xem lại các bài hát đã chọn và tổng tiền (JS tính toán từ localStorage).
    * **Thanh toán QR (Hardcode):** Khi khách bấm "Thanh toán", màn hình hiện ra một ảnh mã QR Code ngân hàng/Momo đã được gắn cứng (hardcode) tĩnh trên HTML kèm nội dung chuyển khoản yêu cầu.
    * **Xác nhận & Mở khóa (Fake Verification):** Khách hàng sau khi quét mã xong sẽ bấm nút "Tôi đã chuyển khoản". Lúc này, JavaScript sẽ dùng `setTimeout` chạy một hiệu ứng loading xoay vòng giả lập trong đúng 5 giây ("Đang xác nhận giao dịch...").
    * **Trả kết quả:** Sau 5 giây, màn hình báo thành công. JS tiến hành xóa localStorage giỏ hàng và chuyển hướng khách sang một trang bí mật, hoặc mở khóa trực tiếp các nút "Download MP3/FLAC" và giao diện Trình phát nhạc (Audio Player) cho các bài hát vừa mua.

* **Flow nghiệp vụ Chat (Static Chat Flow):**
    * **Giao diện:** Một khung chat (Chatbox widget) tự code bằng HTML/CSS nằm ở góc phải dưới màn hình.
    * **Xử lý tin nhắn:** Khi khách hàng nhập tin nhắn cần hỗ trợ và bấm "Gửi", JS sẽ lập tức phản hồi bằng một tin nhắn mặc định gán sẵn: *"Hiện tại CSKH đang bận, vui lòng nhắn tin sau."*
    * **Trạng thái:** Dữ liệu chat không được lưu trữ ở đâu (không backend, không localStorage). Bất cứ khi nào khách tải lại trang (Reload/F5), khung chat sẽ bị xóa trắng và trở về trạng thái ban đầu.

---

### 2. Quản lý & Vận hành (Không có Admin Panel)

* **Quản lý Sản phẩm Nhạc số:** Cập nhật thông tin bài hát, giá tiền, link file audio gốc (Google Drive/Host file) bằng cách chỉnh sửa trực tiếp nội dung trong file `products.json` hoặc HTML, sau đó upload lại lên server tĩnh (Github Pages, Vercel).
* **Quản lý Đơn hàng:** Vì thanh toán bằng QR hardcode và tự động mở khóa sau 5s, chủ shop chỉ cần mở app ngân hàng/Momo của mình lên để đối soát dòng tiền xem có ai chuyển vào không, hệ thống web hoàn toàn tự động (Auto-delivery).