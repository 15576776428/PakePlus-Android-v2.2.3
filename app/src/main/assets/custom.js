window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==========================================
// 移动端触摸适配完整脚本
// ==========================================

(function() {
    // 1. 解决移动端 300ms 延迟 & 点击无响应
    // 这个方法会在 root 节点监听，强行把 touch 事件转成 click 触发
    function initTouchEvents() {
        // 获取根元素，通常 body 或 document
        const root = document.body;
        
        // 核心：禁止移动端双指缩放、长按呼出菜单等干扰行为
        // 如果你需要用户缩放功能，请注释掉这部分
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                // 阻止多指操作（如缩放），避免干预点击
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('gesturestart', function(e) {
            // 彻底禁用系统手势（如 WebView 的左右滑返回）
            e.preventDefault();
        });
        
        // 阻止 iOS 的长按选中、Android 的长按菜单
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }

    // 2. CSS 注入：保证按钮的触摸区域和视觉反馈
    function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            /* 让所有按钮和链接拥有更灵敏的点击区域 */
            a, button, [role="button"], input[type="button"], input[type="submit"], .btn {
                touch-action: manipulation; /* 消除300ms延迟核心 */
                cursor: pointer;
                -webkit-tap-highlight-color: rgba(0,0,0,0.1); /* 给予点击高亮反馈 */
                user-select: none; /* 禁止文字选择，避免干扰 */
                -webkit-user-select: none;
                -webkit-touch-callout: none; /* 禁止iOS长按菜单 */
            }
            
            /* 针对可能的覆盖层，确保点击穿透 */
            body {
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    // 3. 恢复之前的链接处理，但增加移动端容错
    function hookClick() {
        document.addEventListener('click', function(e) {
            const origin = e.target.closest('a');
            const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
            
            if ((origin && origin.href && origin.target === '_blank') ||
                (origin && origin.href && isBaseTargetBlank)) {
                e.preventDefault();
                console.log('[移动端] 处理_blank链接:', origin.href);
                window.location.href = origin.href;
            }
        }, true);
    }
    
    // 执行初始化
    injectStyle();
    initTouchEvents();
    hookClick();

    console.log('移动端适配脚本加载完成');
})();