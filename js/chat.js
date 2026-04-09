/* ===== Hộp chat ===== */

(function () {
    var chatHTML =
        '<button class="chat-toggle" id="chatToggle"><i class="fas fa-comment-dots"></i></button>' +
        '<div class="chatbox" id="chatbox">' +
        '<div class="chat-header">' +
        '<h4>Hỗ trợ khách hàng</h4>' +
        '<span class="chat-status"><i class="fas fa-circle" style="font-size: 0.5rem; color: #22c55e;"></i> Trực tuyến</span>' +
        '</div>' +
        '<div class="chat-messages" id="chatMessages">' +
        '<div class="chat-msg bot">Xin chào! Bạn cần hỗ trợ gì?</div>' +
        '</div>' +
        '<div class="chat-input">' +
        '<input type="text" id="chatInput" placeholder="Nhập tin nhắn...">' +
        '<button id="chatSendBtn"><i class="fas fa-paper-plane"></i></button>' +
        '</div>' +
        '</div>';

    var chatContainer = document.createElement('div');
    // Chèn một lần lúc runtime để tránh lặp markup chat ở tất cả trang HTML.
    chatContainer.innerHTML = chatHTML;
    document.body.appendChild(chatContainer);

    var toggle = document.getElementById('chatToggle');
    var chatbox = document.getElementById('chatbox');
    var messages = document.getElementById('chatMessages');
    var input = document.getElementById('chatInput');
    var sendBtn = document.getElementById('chatSendBtn');

    toggle.addEventListener('click', function () {
        chatbox.classList.toggle('open');
        if (chatbox.classList.contains('open')) {
            // Tự focus giúp giảm thao tác thừa cho người dùng chủ yếu dùng bàn phím khi mở chat.
            input.focus();
        }
    });

    function sendMessage() {
        var text = input.value.trim();
        if (!text) return;

        var userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = text;
        messages.appendChild(userMsg);

        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        setTimeout(function () {
            // Độ trễ nhỏ mô phỏng nhịp phản hồi của người thật để tin nhắn tự động bớt đột ngột.
            var botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            botMsg.textContent = 'Hiện tại CSKH đang bận, vui lòng nhắn tin sau. Cảm ơn bạn!';
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 800);
    }

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
})();
