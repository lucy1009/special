
document.addEventListener("DOMContentLoaded", () => {
    const date = new Date();
    document.getElementById("date").textContent = date.toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric", weekday: "long"
    });

    const userAgent = navigator.userAgent;
    const os = /Android/i.test(userAgent) ? "Android" : /iPhone|iPad|iPod/i.test(userAgent) ? "iOS" :
               /Win/i.test(userAgent) ? "Windows" : /Mac/i.test(userAgent) ? "MacOS" : "其他";
    const browser = userAgent.match(/(Firefox|Chrome|Safari|Edge|Opera)\/[\d.]+/g)?.[0] || "未知浏览器";

    document.getElementById("os").textContent = os;
    document.getElementById("browser").textContent = browser;

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            document.getElementById("ip").textContent = data.ip;
            document.getElementById("location").textContent = data.country_name + data.region + data.city;
        });

    // 荧光粒子效果
    const canvas = document.getElementById("glowCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random();
        this.dx = Math.random() * 0.5 - 0.25;
        this.dy = Math.random() * -0.5 - 0.2;
    }
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,200,${this.alpha})`;
        ctx.fill();
    };
    Particle.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y < 0) this.y = canvas.height;
        if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width;
    };

    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
});
