document.addEventListener('DOMContentLoaded', function () {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(0,0,0,0.7);
    color: #fff;
    font-size: 14px;
    padding: 12px 0;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(6px);
    border-top: 1px solid rgba(255,255,255,0.1);
  `;
  footer.innerHTML = `
    <img src="./images/character.png" alt="character" style="height: 45px; vertical-align: middle; margin-right: 12px; border-radius: 50%;">
    <span>🌐 您正在浏览本服务 | ✨ 炫酷特效已加载</span>
  `;
  document.body.appendChild(footer);

  // 添加荧光粒子特效
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
