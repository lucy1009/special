document.addEventListener('DOMContentLoaded', function () {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(0,0,0,0.7);
    color: #fff;
    font-size: 14px;
    padding: 12px;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(6px);
    line-height: 1.8;
  `;
  footer.innerHTML = `正在获取访问信息...`;
  document.body.appendChild(footer);

  // 获取当前时间
  function getDateStr() {
    const now = new Date();
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    return `📅 今天是 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
  }

  // 获取浏览器 & 系统信息
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    const os = /Windows/i.test(ua) ? 'Windows' :
               /Android/i.test(ua) ? 'Android' :
               /iPhone|iPad/i.test(ua) ? 'iOS' :
               /Mac/i.test(ua) ? 'MacOS' : '未知系统';

    const browser = /Chrome\/([\d.]+)/.exec(ua) ? `Chrome (${RegExp.$1})` :
                    /Firefox\/([\d.]+)/.exec(ua) ? `Firefox (${RegExp.$1})` :
                    /Safari\/([\d.]+)/.exec(ua) ? `Safari` : '未知浏览器';

    return {
      os,
      browser
    };
  }

  // 获取 IP 和地理位置
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const { ip, country_name, region, city } = data;
      const { os, browser } = getBrowserInfo();
      const msg = `
        🏠 欢迎您来自 ${country_name} ${region} ${city} 的朋友<br>
        ${getDateStr()}<br>
        📖 您的 IP 是: ${ip}<br>
        🖥️ 您使用的是 ${os} 操作系统<br>
        🌐 您使用的是 ${browser} 浏览器
      `;
      footer.innerHTML = msg;
    })
    .catch(() => {
      const { os, browser } = getBrowserInfo();
      const fallback = `
        🏠 欢迎您，朋友<br>
        ${getDateStr()}<br>
        📖 IP 信息获取失败<br>
        🖥️ 您使用的是 ${os} 操作系统<br>
        🌐 您使用的是 ${browser} 浏览器
      `;
      footer.innerHTML = fallback;
    });
});
