/* ===== Luồng thanh toán ===== */

(function () {
    var checkoutContent = document.getElementById('checkoutContent');
    var loadingOverlay = document.getElementById('loadingOverlay');

    var items = Cart.getCart();

    if (items.length === 0) {
        // Chặn thanh toán khi giỏ trống để tránh luồng trả tiền giả do truy cập URL trực tiếp.
        checkoutContent.innerHTML =
            '<div class="empty-state">' +
            '<div class="empty-icon"><i class="fas fa-shopping-cart"></i></div>' +
            '<h3>Gio hang trong</h3>' +
            '<p>Vui long them san pham truoc khi thanh toan.</p>' +
            '<a href="index.html" class="btn-pill btn-pill-filled">Mua sam ngay</a>' +
            '</div>';
        return;
    }

    var summaryHTML = items
        .map(function (item) {
            return (
                '<div class="summary-row">' +
                '<span>' +
                item.title +
                ' - ' +
                item.artist +
                ' (x' +
                item.qty +
                ')</span>' +
                '<span>' +
                Cart.formatPrice(item.price * item.qty) +
                '</span>' +
                '</div>'
            );
        })
        .join('');

    checkoutContent.innerHTML =
        '<div class="row g-4">' +
        '<div class="col-md-6">' +
        '<div class="qr-section">' +
        '<h3>Quet ma de thanh toan</h3>' +
        '<p class="text-muted-custom">Chuyen khoan qua Momo hoac ngan hang</p>' +
        '<div class="qr-image">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="180" height="180">' +
        '<rect width="200" height="200" fill="white"/>' +
        '<rect x="20" y="20" width="40" height="40" fill="#111"/>' +
        '<rect x="140" y="20" width="40" height="40" fill="#111"/>' +
        '<rect x="20" y="140" width="40" height="40" fill="#111"/>' +
        '<rect x="80" y="20" width="10" height="10" fill="#111"/>' +
        '<rect x="100" y="30" width="10" height="10" fill="#111"/>' +
        '<rect x="80" y="50" width="10" height="10" fill="#111"/>' +
        '<rect x="90" y="80" width="20" height="20" fill="#111"/>' +
        '<rect x="70" y="100" width="10" height="10" fill="#111"/>' +
        '<rect x="120" y="100" width="10" height="10" fill="#111"/>' +
        '<rect x="140" y="80" width="10" height="10" fill="#111"/>' +
        '<rect x="160" y="90" width="10" height="10" fill="#111"/>' +
        '<rect x="80" y="140" width="10" height="10" fill="#111"/>' +
        '<rect x="100" y="150" width="10" height="10" fill="#111"/>' +
        '<rect x="120" y="140" width="10" height="10" fill="#111"/>' +
        '<rect x="140" y="150" width="20" height="20" fill="#111"/>' +
        '<rect x="160" y="140" width="10" height="10" fill="#111"/>' +
        '</svg>' +
        '</div>' +
        '<div class="qr-info">' +
        '<strong>Ngan hang:</strong> Vietcombank<br>' +
        '<strong>STK:</strong> 1234 5678 9000<br>' +
        '<strong>Chu TK:</strong> KPOP STORE<br>' +
        '<strong>Noi dung CK:</strong> KPOP ' +
        // Hậu tố timestamp ngắn tạo mã chuyển khoản gọn để người dùng đối chiếu từ lịch sử ngân hàng.
        Date.now().toString().slice(-6) +
        '<br>' +
        '<strong>So tien:</strong> ' +
        Cart.formatPrice(Cart.getCartTotal()) +
        '</div>' +
        '<button class="btn-pill btn-pill-filled btn-pill-block" id="confirmPayBtn">' +
        '<i class="fas fa-check"></i> Toi da chuyen khoan' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div class="cart-summary">' +
        '<h5 style="font-family: var(--font-heading); margin-bottom: 16px;">Don hang cua ban</h5>' +
        summaryHTML +
        '<div class="summary-total">' +
        '<span>Tong cong</span>' +
        '<span>' +
        Cart.formatPrice(Cart.getCartTotal()) +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    document.getElementById('confirmPayBtn').addEventListener('click', function () {
        Cart.savePurchased(items);
        loadingOverlay.style.display = 'flex';
        setTimeout(function () {
            // Độ trễ giữ tín hiệu loading đủ lâu để người dùng nhận biết trạng thái đang chuyển.
            Cart.clearCart();
            window.location.href = 'success.html';
        }, 5000);
    });
})();
