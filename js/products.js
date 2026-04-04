/* ===== Sản phẩm: Tải, Render, Lọc, Tìm kiếm ===== */

(function () {
    var products = [];
    var currentFilter = 'all';
    var currentSearch = '';
    // Số lượng được giữ theo từng thẻ để người dùng gom nhiều lựa chọn mà không cần mở từng trang chi tiết.
    var cardQty = {};

    var grid = document.getElementById('productGrid');
    var emptyState = document.getElementById('emptyState');
    var filterBar = document.getElementById('filterBar');
    var searchInput = document.getElementById('searchInput');

    function loadProducts() {
        fetch('data/products.json')
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                products = data;
                products.forEach(function (p) {
                    // Khởi tạo số lượng mặc định một lần để các lần render lại luôn ổn định.
                    cardQty[p.id] = 1;
                });
                buildFilters();
                renderProducts();
            })
            .catch(function () {
                if (grid) grid.innerHTML = '<p style="color: var(--gray);">Khong the tai du lieu san pham.</p>';
            });
    }

    function buildFilters() {
        if (!filterBar) return;
        var artists = [];
        products.forEach(function (p) {
            if (artists.indexOf(p.artist) === -1) artists.push(p.artist);
        });

        artists.forEach(function (artist) {
            var btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', artist);
            btn.textContent = artist;
            filterBar.appendChild(btn);
        });

        filterBar.addEventListener('click', function (e) {
            if (!e.target.classList.contains('filter-btn')) return;
            currentFilter = e.target.getAttribute('data-filter');
            filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            renderProducts();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentSearch = this.value.toLowerCase().trim();
            renderProducts();
        });
    }

    function getFilteredProducts() {
        return products.filter(function (p) {
            var matchFilter = currentFilter === 'all' || p.artist === currentFilter;
            var matchSearch =
                !currentSearch ||
                p.title.toLowerCase().indexOf(currentSearch) !== -1 ||
                p.artist.toLowerCase().indexOf(currentSearch) !== -1 ||
                p.genre.toLowerCase().indexOf(currentSearch) !== -1;
            return matchFilter && matchSearch;
        });
    }

    function renderProducts() {
        if (!grid) return;

        var filtered = getFilteredProducts();

        if (filtered.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        grid.innerHTML = filtered
            .map(function (p) {
                var qty = cardQty[p.id] || 1;
                return (
                    '<div class="product-card">' +
                    '<a href="product.html?id=' +
                    p.id +
                    '" class="card-image">' +
                    '<img src="' +
                    p.cover +
                    '" alt="' +
                    p.title +
                    '" loading="lazy">' +
                    '<span class="card-type-badge">' +
                    p.type +
                    '</span>' +
                    '</a>' +
                    '<div class="card-body">' +
                    '<div class="card-artist">' +
                    p.artist +
                    '</div>' +
                    '<div class="card-title"><a href="product.html?id=' +
                    p.id +
                    '">' +
                    p.title +
                    '</a></div>' +
                    '<div class="card-price">' +
                    Cart.formatPrice(p.price) +
                    '</div>' +
                    '<div class="qty-selector">' +
                    '<button onclick="changeCardQty(\'' +
                    p.id +
                    '\', -1)"><i class="fas fa-minus"></i></button>' +
                    '<span class="qty-value" id="qty-' +
                    p.id +
                    '">' +
                    qty +
                    '</span>' +
                    '<button onclick="changeCardQty(\'' +
                    p.id +
                    '\', 1)"><i class="fas fa-plus"></i></button>' +
                    '</div>' +
                    '<button class="btn-pill btn-pill-filled btn-pill-block" onclick="addProductToCart(\'' +
                    p.id +
                    '\')">' +
                    '<i class="fas fa-cart-plus"></i> Add to Cart' +
                    '</button>' +
                    '</div>' +
                    '</div>'
                );
            })
            .join('');
    }

    // Đổi số lượng trên thẻ (trước khi thêm vào giỏ)
    window.changeCardQty = function (id, delta) {
        var current = cardQty[id] || 1;
        var newQty = current + delta;
        if (newQty < 1) newQty = 1;
        cardQty[id] = newQty;
        var el = document.getElementById('qty-' + id);
        if (el) el.textContent = newQty;
    };

    // Thêm vào giỏ theo số lượng đã chọn
    window.addProductToCart = function (id) {
        var product = products.find(function (p) {
            return p.id === id;
        });
        if (product) {
            var qty = cardQty[id] || 1;
            Cart.addToCart(product, qty);
            // Reset sau khi thêm để tránh cộng dồn ngoài ý muốn khi bấm lặp trên cùng một thẻ.
            cardQty[id] = 1;
            var el = document.getElementById('qty-' + id);
            if (el) el.textContent = '1';
        }
    };

    document.addEventListener('DOMContentLoaded', loadProducts);
})();
