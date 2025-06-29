document.addEventListener('DOMContentLoaded', function () {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(30, 30, 30, 0.4);
    color: #fff;
    font-size: 14px;
    padding: 12px 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(8px);
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

  function getDateStr() {
    const now = new Date();
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    return `📅 今天是 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
  }

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

  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(ipData => {
      const ip = ipData.ip;
      const amapKey = '替换为你的高德Key'; // ← 请改成你自己的 key

      fetch(`https://restapi.amap.com/v3/ip?ip=${ip}&key=${amapKey}`)
        .then(res => res.json())
        .then(locationData => {
          const province = locationData.province;
          const city = locationData.city;

          if (!province || !city || Array.isArray(province) || Array.isArray(city)) {
            fallbackLoad(ip);
            return;
          }

          const { os, browser } = getBrowserInfo();
          left.innerHTML = `
            🏠 欢迎您来自 中国 ${province} ${city} 的朋友<br>
            ${getDateStr()}<br>
            📖 您的 IP 是: ${ip}<br>
            🖥️ 您使用的是 ${os} 操作系统<br>
            🌐 您使用的是 ${browser} 浏览器
          `;
        })
        .catch(() => fallbackLoad(ip));
    })
    .catch(() => fallbackLoad('未知IP'));

  function fallbackLoad(ip) {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        let { country_name, region, city } = data;
        const { os, browser } = getBrowserInfo();

        if (window.ChinaGeoMap) {
          country_name = window.ChinaGeoMap.country[country_name] || country_name;
          region = window.ChinaGeoMap.province[region] || region;
          city = window.ChinaGeoMap.city[city] || city;
        }

        left.innerHTML = `
          🏠 欢迎您来自 ${country_name} ${region} ${city} 的朋友<br>
          ${getDateStr()}<br>
          📖 您的 IP 是: ${ip}<br>
          🖥️ 您使用的是 ${os} 操作系统<br>
          🌐 您使用的是 ${browser} 浏览器
        `;
      });
  }
});
