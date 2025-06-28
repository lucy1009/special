
document.addEventListener('DOMContentLoaded', function () {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    background: rgba(0,0,0,0.6);
    color: #eee;
    font-size: 14px;
    padding: 10px 0;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(4px);
  `;
  footer.innerHTML = \`
    <img src="./images/character.png" alt="character" style="height: 40px; vertical-align: middle; margin-right: 10px;">
    <span>服务器运行良好 | 由 GitHub Pages 强力驱动</span>
  \`;
  document.body.appendChild(footer);

  // 添加飞舞荧光特效
  const glowStyle = document.createElement('style');
  glowStyle.innerHTML = \`
  .glow-dot {
    position: fixed;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(173,216,230,0.7);
    box-shadow: 0 0 6px rgba(173,216,230,0.9);
    pointer-events: none;
    animation: float-glow 5s linear infinite;
  }

  @keyframes float-glow {
    0% {transform: translateY(0) scale(1);}
    100% {transform: translateY(-100vh) scale(0.5);}
  }\`;
  document.head.appendChild(glowStyle);

  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.className = 'glow-dot';
    dot.style.left = Math.random() * 100 + 'vw';
    dot.style.bottom = Math.random() * 100 + 'px';
    dot.style.animationDuration = 5 + Math.random() * 5 + 's';
    document.body.appendChild(dot);
  }
});
