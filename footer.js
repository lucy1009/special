document.addEventListener('DOMContentLoaded', function () {
  // 创建底部信息栏
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(30, 30, 30, 0.5);
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

  // 创建泡泡容器
  const bubbleContainer = document.createElement('div');
  bubbleContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
  `;
  document.body.appendChild(bubbleContainer);

  // 泡泡特效
  function createBubble() {
    const bubble = document.createElement('div');
    const size = Math.random() * 60 + 20;
    const posX = Math.random() * window.innerWidth;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.3;
    
    bubble.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, ${opacity});
      border-radius: 50%;
      bottom: -${size}px;
      left: ${posX}px;
      animation: float-up ${duration}s linear ${delay}s infinite;
      filter: blur(${Math.random() * 3 + 1}px);
    `;

    bubbleContainer.appendChild(bubble);

    // 移除超出屏幕的泡泡
    setTimeout(() => {
      bubble.remove();
    }, (duration + delay) * 1000);
  }

  // 添加泡泡动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% {
        transform: translateY(0) scale(1);
        opacity: ${Math.random() * 0.5 + 0.3};
      }
      50% {
        transform: translateY(-50vh) scale(0.8);
        opacity: ${Math.random() * 0.3 + 0.1};
      }
      100% {
        transform: translateY(-100vh) scale(0.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 定期生成泡泡
  setInterval(createBubble, 500);

  // 原有功能函数
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

  // 改进后的IP获取逻辑
  function loadVisitorInfo() {
    fetch('https://api.ipify.org?format=json')
      .then(res => {
        if (!res.ok) throw new Error('IP获取失败');
        return res.json();
      })
      .then(ipData => {
        const ip = ipData.ip;
        // 这里建议使用你自己的API密钥或后端服务
        fetch(`https://restapi.amap.com/v3/ip?ip=${ip}&key=85caef68c262151c986a61d063bbd5a9`)//高德api
          .then(res => {
            if (!res.ok) throw new Error('高德定位失败');
            return res.json();
          })
          .then(locationData => {
            updateUI(ip, locationData.province, locationData.city);
          })
          .catch(() => fallbackLoad(ip));
      })
      .catch(() => fallbackLoad('未知IP'));
  }

  function fallbackLoad(ip) {
    fetch('https://ipapi.co/json/')
      .then(res => {
        if (!res.ok) throw new Error('备用IP获取失败');
        return res.json();
      })
      .then(data => {
        updateUI(ip, data.region, data.city, data.country_name);
      })
      .catch(() => {
        const { os, browser } = getBrowserInfo();
        left.innerHTML = `
          ${getDateStr()}<br>
          📖 无法获取位置信息<br>
          🖥️ 您使用的是 ${os} 操作系统<br>
          🌐 您使用的是 ${browser} 浏览器
        `;
      });
  }

  function updateUI(ip, province, city, country = '中国') {
    // 使用地理中文库转换
    if (window.ChinaGeoMap) {
      province = window.ChinaGeoMap.province[province] || province;
      city = window.ChinaGeoMap.city[city] || city;
      country = window.ChinaGeoMap.country[country] || country;
    }

    const { os, browser } = getBrowserInfo();
    const locationStr = (province === city) ? province : `${province} ${city}`;

    left.innerHTML = `
      🏠 欢迎您来自 ${country} ${locationStr} 的朋友<br>
      ${getDateStr()}<br>
      📖 您的 IP 是: ${ip}<br>
      🖥️ 您使用的是 ${os} 操作系统<br>
      🌐 您使用的是 ${browser} 浏览器
    `;
  }

  // 启动信息加载
  loadVisitorInfo();
});
