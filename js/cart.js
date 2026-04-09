/* ===== Mô-đun giỏ hàng (localStorage) có hỗ trợ số lượng ===== */

var Cart = (function () {
    var CART_KEY = 'kpop_cart';
    var PURCHASED_KEY = 'kpop_purchased';

    function getCart() {
        var data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        // Cập nhật badge ngay khi ghi dữ liệu để mọi trang phản ánh trạng thái giỏ mà không cần tải lại.
        updateBadge();
    }

    function addToCart(product, qty) {
        var cart = getCart();
        var existing = cart.find(function (item) {
            return item.id === product.id;
        });

        if (existing) {
            existing.qty += qty || 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                artist: product.artist,
                price: product.price,
                cover: product.cover,
                format: product.format,
                download: product.download,
                qty: qty || 1,
            });
        }

        saveCart(cart);
        showToast('Giỏ hàng', 'Đã thêm "' + product.title + '" vào giỏ hàng!');
        return true;
    }

    function updateQuantity(id, delta) {
        var cart = getCart();
        var item = cart.find(function (i) {
            return i.id === id;
        });
        if (!item) return;

        item.qty += delta;
        // Chặn mức tối thiểu là 1 thay vì tự xóa để tránh mất dữ liệu do bấm trừ liên tục.
        if (item.qty < 1) item.qty = 1;
        saveCart(cart);
    }

    function removeFromCart(id) {
        var cart = getCart();
        cart = cart.filter(function (item) {
            return item.id !== id;
        });
        saveCart(cart);
    }

    function clearCart() {
        // Sản phẩm đã mua được lưu riêng, nên xóa trạng thái thanh toán không được xóa lịch sử tải.
        localStorage.removeItem(CART_KEY);
        updateBadge();
    }

    function getCartCount() {
        var cart = getCart();
        return cart.reduce(function (sum, item) {
            return sum + item.qty;
        }, 0);
    }

    function getCartTotal() {
        var cart = getCart();
        return cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);
    }

    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    }

    function updateBadge() {
        var badge = document.getElementById('cartBadge');
        if (!badge) return;
        var count = getCartCount();
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }

    function savePurchased(items) {
        localStorage.setItem(PURCHASED_KEY, JSON.stringify(items));
    }

    function getPurchased() {
        var data = localStorage.getItem(PURCHASED_KEY);
        return data ? JSON.parse(data) : [];
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Một số trang chỉ mount badge sau khi parse HTML, nên đồng bộ lại khi DOM sẵn sàng.
        updateBadge();
    });

    return {
        getCart: getCart,
        addToCart: addToCart,
        updateQuantity: updateQuantity,
        removeFromCart: removeFromCart,
        clearCart: clearCart,
        getCartCount: getCartCount,
        getCartTotal: getCartTotal,
        formatPrice: formatPrice,
        updateBadge: updateBadge,
        savePurchased: savePurchased,
        getPurchased: getPurchased,
    };
})();

/* ===== Hàm hỗ trợ toast ===== */
function showToast(title, message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<div class="toast-title">' + title + '</div>' + message;
    container.appendChild(toast);

    setTimeout(function () {
        // Dọn thủ công để node toast cũ không tích tụ khi người dùng duyệt trang lâu.
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
}
