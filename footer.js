document.addEventListener('DOMContentLoaded', function () {
    // 1. 底部信息栏
    const footer = document.createElement('div');
    footer.style.cssText = `
        width: 100%; background: rgba(30, 30, 30, 0.5); color: #fff;
        padding: 12px 20px; position: fixed; bottom: 0; left: 0;
        z-index: 9999; backdrop-filter: blur(8px);
        display: flex; justify-content: space-between; align-items: center;
    `;
    
    const left = document.createElement('div');
    left.innerHTML = `<div class="loading">🌐 正在获取位置信息...</div>`;
    left.style.lineHeight = '1.8';
    
    footer.appendChild(left);
    document.body.appendChild(footer);

    // 2. 泡泡特效（保持不变）
    const bubbleContainer = document.createElement('div');
    bubbleContainer.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 9998; overflow: hidden;
    `;
    document.body.appendChild(bubbleContainer);

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: absolute;
            width: ${Math.random() * 40 + 10}px;
            height: ${Math.random() * 40 + 10}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            bottom: -50px;
            left: ${Math.random() * window.innerWidth}px;
            animation: float-up ${Math.random() * 10 + 5}s linear infinite;
            filter: blur(${Math.random() * 2}px);
        `;
        bubbleContainer.appendChild(bubble);
        bubble.addEventListener('animationend', () => bubble.remove());
    }
    setInterval(createBubble, 500);

    // 3. 安全使用高德API的方案
    async function getLocationByAMap(ip) {
        // 方案1（推荐）：通过你自己的后端转发请求
        const res = await fetch(`/amap-proxy?ip=${ip}`); // 你需要自己实现这个后端接口
        if (res.ok) return await res.json();
        
        // 方案2（备选）：直接调用（需替换YOUR_AMAP_KEY）
        const amapKey = '85caef68c262151c986a61d063bbd5a9'; // 🔴 记得替换！建议用后端环境变量存储
        const amapRes = await fetch(`https://restapi.amap.com/v3/ip?ip=${ip}&key=${amapKey}`);
        return amapRes.ok ? await amapRes.json() : null;
    }

    // 4. 主逻辑
    async function loadVisitorInfo() {
        const { os, browser } = getBrowserInfo();
        
        try {
            // 获取IP（优先使用ipify）
            const ip = await fetch('https://api.ipify.org?format=json')
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(data => data.ip || '未知IP')
                .catch(() => '未知IP');

            // 获取位置（优先使用高德）
            let location = await getLocationByAMap(ip);
            if (!location) {
                location = await fetch('https://ipapi.co/json')
                    .then(res => res.ok ? res.json() : Promise.reject())
                    .catch(() => null);
            }

            // 显示结果
            left.innerHTML = formatInfo(ip, location, os, browser);
        } catch (error) {
            left.innerHTML = `
                ${getDateStr()}<br>
                📡 网络请求失败<br>
                🖥️ ${os} | 🌐 ${browser}
            `;
        }
    }

    // 辅助函数
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        return {
            os: /Windows/i.test(ua) ? 'Windows' : /Android/i.test(ua) ? 'Android' : 
                /iPhone|iPad/i.test(ua) ? 'iOS' : /Mac/i.test(ua) ? 'MacOS' : '未知系统',
            browser: /Chrome\//i.test(ua) ? 'Chrome' : /Firefox\//i.test(ua) ? 'Firefox' : 
                    /Safari/i.test(ua) ? 'Safari' : '未知浏览器'
        };
    }

    function getDateStr() {
        const now = new Date();
        const weekdays = ['日','一','二','三','四','五','六'];
        return `📅 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
    }

    function formatInfo(ip, location, os, browser) {
        let locationStr = '未知地区';
        if (location) {
            if (location.province) { // 高德返回格式
                locationStr = location.city === location.province ? 
                    location.province : `${location.province} ${location.city}`;
            } else if (location.country) { // ipapi返回格式
                locationStr = location.region === location.city ? 
                    `${location.country} ${location.city}` : 
                    `${location.country} ${location.region} ${location.city}`;
            }
        }

        return `
            🏠 欢迎来自 ${locationStr} 的朋友<br>
            ${getDateStr()}<br>
            📡 IP: ${ip}<br>
            🖥️ ${os} | 🌐 ${browser}
        `;
    }

    // 启动
    loadVisitorInfo();
});
