document.addEventListener('DOMContentLoaded', function () {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(30,30,30,0.4);
    color: #fff;
    font-size: 14px;
    padding: 12px 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  `;

  const left = document.createElement('div');
  const right = document.createElement('div');

  left.innerHTML = `正在获取访问信息...`;
  left.style.lineHeight = '1.8';
  right.innerHTML = `<img src="./images/character.png" style="height:60px;border-radius:8px;">`;

  footer.appendChild(left);
  footer.appendChild(right);
  document.body.appendChild(footer);

  // 时间
  function getDateStr() {
    const now = new Date();
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    return `📅 今天是 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
  }

  // 系统 + 浏览器
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    const os = /Windows/i.test(ua) ? 'Windows' :
               /Android/i.test(ua) ? 'Android' :
               /iPhone|iPad/i.test(ua) ? 'iOS' :
               /Mac/i.test(ua) ? 'MacOS' : '未知系统';

    const browser = /Chrome\/([\d.]+)/.exec(ua) ? `Chrome (${RegExp.$1})` :
                    /Firefox\/([\d.]+)/.exec(ua) ? `Firefox (${RegExp.$1})` :
                    /Safari\/([\d.]+)/.exec(ua) ? `Safari` : '未知浏览器';

    return { os, browser };
  }

  // 获取 IP + 地理
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const { ip, country_name, region, city } = data;
      const { os, browser } = getBrowserInfo();
      left.innerHTML = `
        🏠 欢迎您来自 ${country_name} ${region} ${city} 的朋友<br>
        ${getDateStr()}<br>
        📖 您的 IP 是: ${ip}<br>
        🖥️ 您使用的是 ${os} 操作系统<br>
        🌐 您使用的是 ${browser} 浏览器
      `;
    })
    .catch(() => {
      const { os, browser } = getBrowserInfo();
      left.innerHTML = `
        🏠 欢迎您，朋友<br>
        ${getDateStr()}<br>
        📖 IP 信息获取失败<br>
        🖥️ 您使用的是 ${os} 操作系统<br>
        🌐 您使用的是 ${browser} 浏览器
      `;
    });

  // ✨ 粒子特效
  const style = document.createElement('style');
  style.innerHTML = `
    .glow-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(0,255,255,0.1) 100%);
      box-shadow: 0 0 8px rgba(0,255,255,0.6);
      pointer-events: none;
      animation: float-glow linear infinite;
    }
    @keyframes float-glow {
      from { transform: translateY(0) scale(1); opacity: 1; }
      to { transform: translateY(-100vh) scale(0.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('div');
    dot.className = 'glow-dot';
    dot.style.left = Math.random() * 100 + 'vw';
    dot.style.bottom = Math.random() * window.innerHeight + 'px';
    dot.style.animationDuration = (4 + Math.random() * 4).toFixed(2) + 's';
    dot.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
    document.body.appendChild(dot);
  }
});
