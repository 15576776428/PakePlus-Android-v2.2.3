window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==========================================
// 性能优化 + 移动端适配完整脚本
// ==========================================

(function() {
    'use strict';

    // ========== 1. 延迟非关键资源加载 ==========
    // 页面加载完成后，再加载耗时的第三方资源
    function deferNonCriticalResources() {
        // 获取所有脚本标签
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src.toLowerCase();
            // Cloudflare 验证、分析工具、广告等延迟加载
            if (src.includes('cdn-cgi') || 
                src.includes('analytics') || 
                src.includes('gtag') ||
                src.includes('facebook') ||
                src.includes('tracking')) {
                // 改为异步加载，不阻塞页面
                script.setAttribute('async', 'true');
                script.setAttribute('defer', 'true');
                console.log('延迟加载:', src);
            }
        });
    }

    // ========== 2. 点击事件优先处理 ==========
    // 使用捕获阶段 + requestAnimationFrame 确保点击优先
    function initFastClick() {
        // 方案A：直接在最顶层捕获，不等资源加载
        document.addEventListener('click', function(e) {
            const target = e.target;
            const anchor = target.closest('a');
            
            // 如果是链接，立即处理，不等任何东西
            if (anchor && anchor.href) {
                const href = anchor.href;
                
                // 跳过 javascript: 伪协议
                if (href.startsWith('javascript:')) return;
                
                // 跳过锚点链接
                if (href.indexOf('#') === 0) return;
                
                // 处理 _blank 链接
                if (anchor.target === '_blank' || 
                    document.querySelector('head base[target="_blank"]')) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // 阻止其他事件处理
                    
                    // 立即跳转，不等待
                    window.location.href = href;
                    console.log('快速跳转:', href);
                }
            }
        }, true); // true = 捕获阶段，优先于任何其他事件
    }

    // ========== 3. CSS 注入：确保按钮立即可交互 ==========
    function injectCriticalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 让所有交互元素立即可用 */
            a, button, [role="button"], input[type="button"], 
            input[type="submit"], .btn, [onclick] {
                touch-action: manipulation;
                cursor: pointer;
                /* 立即显示手型光标，不等CSS加载 */
            }
            
            /* 降低非关键内容的渲染优先级 */
            img:not([loading="eager"]) {
                content-visibility: auto;
            }
            
            iframe, video, [data-lazy] {
                content-visibility: auto;
            }
        `;
        // 插入到 head 最前面
        document.head.insertBefore(style, document.head.firstChild);
    }

    // ========== 4. 资源加载完成前显示进度提示 ==========
    function showLoadingState() {
        // 检查是否有大量资源还在加载
        let pendingResources = performance.getEntriesByType('resource')
            .filter(r => r.responseEnd === 0).length;
        
        if (pendingResources > 5) {
            // 给 body 添加加载状态，CSS 可以用它显示加载指示器
            document.body.classList.add('resources-loading');
        }
        
        // 所有资源加载完成后移除状态
        window.addEventListener('load', function() {
            document.body.classList.remove('resources-loading');
            document.body.classList.add('resources-loaded');
        });
    }

    // ========== 5. 防止资源加载期间的白屏/假死 ==========
    function preventLoadingFreeze() {
        // 使用 requestIdleCallback 处理非紧急任务
        const idleCallback = window.requestIdleCallback || function(cb) {
            return setTimeout(cb, 50);
        };
        
        // 将所有非关键操作延迟到空闲时间
        idleCallback(() => {
            deferNonCriticalResources();
            showLoadingState();
        });
        
        // 监听长时间任务，避免主线程阻塞
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 100) {
                            console.warn('长任务检测:', entry.duration + 'ms');
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask 可能不被支持
            }
        }
    }

    // ========== 初始化 ==========
    function init() {
        // 1. 先注入关键CSS（同步执行）
        injectCriticalCSS();
        
        // 2. 立即启动快速点击（同步执行）
        initFastClick();
        
        // 3. 异步处理资源优化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', preventLoadingFreeze);
        } else {
            preventLoadingFreeze();
        }
        
        console.log('性能优化脚本加载完成 - 页面已可交互');
    }

    // 立即执行初始化
    init();
})();