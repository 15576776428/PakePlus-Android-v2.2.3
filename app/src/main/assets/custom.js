window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==========================================
// 极度保守的 WebView 兼容脚本
// ==========================================

// 1. 不要重写 window.open，而是通过事件监听来控制行为
(function() {
    // 禁止 Cloudflare 挑战脚本可能触发的问题
    if (window.location.href.indexOf('cdn-cgi/challenge-platform') !== -1) {
        console.log('Cloudflare challenge detected, attempting bypass...');
        // 如果可能，尝试通知页面验证已通过
        window.dispatchEvent(new Event('cf-chl-opt'));
    }

    // 2. 安全的链接拦截
    document.addEventListener('click', function(e) {
        var target = e.target;
        var anchor = target.closest('a');
        
        if (!anchor || !anchor.href) return;
        
        // 忽略 javascript: 和其他伪协议
        if (anchor.href.startsWith('javascript:')) return;
        
        // 处理 _blank 链接
        var isBlank = anchor.target === '_blank';
        var baseBlank = document.querySelector('head base[target="_blank"]');
        
        if (isBlank || (baseBlank && !anchor.target)) {
            e.preventDefault();
            e.stopPropagation();
            
            // 使用 setTimeout 确保 WebView 正确处理
            setTimeout(function() {
                window.location.href = anchor.href;
            }, 0);
        }
    }, true);

    // 3. 处理可能的 window.open 调用（但不清除原生功能）
    var _originalOpen = window.open;
    window.open = function(url, target, features) {
        console.log('window.open called with:', url);
        
        // 如果是 Cloudflare 相关的 URL，不处理
        if (url && url.indexOf('cdn-cgi') !== -1) {
            return null;
        }
        
        // 如果是正常的 HTTP/HTTPS 链接
        if (typeof url === 'string' && (url.indexOf('http') === 0)) {
            window.location.href = url;
            return null;
        }
        
        // 其他协议（tel:, mailto:, intent://）保持原生行为
        try {
            return _originalOpen.call(window, url, target, features);
        } catch(e) {
            console.error('window.open failed:', e);
            return null;
        }
    };

    // 4. 捕获所有未处理的错误，防止它们导致 WebView 崩溃
    window.onerror = function(msg, url, line, col, error) {
        console.error('Global error caught:', msg, 'at', url, ':', line);
        // 如果是 Cloudflare 脚本的错误，忽略它
        if (url && url.indexOf('cdn-cgi') !== -1) {
            return true; // 阻止错误冒泡
        }
        return false;
    };

    // 5. 处理未捕获的 Promise 错误
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled rejection:', event.reason);
        // 防止错误导致 WebView 崩溃
        event.preventDefault();
    });
})();