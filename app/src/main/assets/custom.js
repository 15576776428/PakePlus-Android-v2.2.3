window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==========================================
// 性能优化 + 外部跳转（精简版）
// ==========================================
(function() {
    'use strict';

    // ===== 1. 外部跳转（只保留核心）=====
    const externalDomains = [
        'accounts.google.com',
        'recaptcha',
        'gstatic.com/recaptcha',
        'challenge-platform'
    ];

    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (!anchor || !anchor.href) return;

        for (let domain of externalDomains) {
            if (anchor.href.includes(domain)) {
                e.preventDefault();
                e.stopPropagation();
                window.open(anchor.href, '_blank');
                return;
            }
        }
    }, true);

    // ===== 2. 性能优化 =====
    // 禁止图片懒加载以外的资源阻塞
    const observer = new MutationObserver(function() {
        // 移除不必要的动画和特效
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.animationDuration !== '0s' && parseFloat(style.animationDuration) > 0.5) {
                el.style.animationDuration = '0.1s';
            }
            if (style.transitionDuration !== '0s' && parseFloat(style.transitionDuration) > 0.3) {
                el.style.transitionDuration = '0.1s';
            }
        });
    });

    // 页面加载完成后执行一次
    window.addEventListener('load', function() {
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // ===== 3. 减少重绘 =====
    document.addEventListener('touchmove', function(e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        // 其他地方不动
    }, { passive: true });

    console.log('精简优化脚本已加载');
})();