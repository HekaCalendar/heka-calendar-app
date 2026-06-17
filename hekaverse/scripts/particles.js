/* ============================================================
   HEKAVERSE — Particle System
   Nun: The primordial void, alive with golden dust
   ============================================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let animationId;
  let isVisible = true;

  // Configuration
  const CONFIG = {
    particleCount: window.innerWidth < 768 ? 300 : 800,
    baseSpeed: 0.15,
    mouseRadius: 150,
    mouseForce: 0.8,
    driftSpeed: 0.3,
    colors: [
      'rgba(212, 175, 55, ',   // gold
      'rgba(201, 184, 232, ',  // maat purple
      'rgba(232, 106, 60, ',   // heka flame
      'rgba(240, 237, 232, ',  // stella white
    ],
    minSize: 0.5,
    maxSize: 2.5,
  };

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
      this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
      this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      this.colorIndex = Math.floor(Math.random() * CONFIG.colors.length);
      this.alpha = 0.1 + Math.random() * 0.5;
      this.alphaSpeed = 0.002 + Math.random() * 0.005;
      this.alphaDir = Math.random() > 0.5 ? 1 : -1;
      this.driftAngle = Math.random() * Math.PI * 2;
      this.driftRadius = 20 + Math.random() * 80;
      this.driftSpeed = 0.0005 + Math.random() * 0.001;
      this.driftOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Natural drift (figure-8 / orbital pattern)
      this.driftOffset += this.driftSpeed;
      const driftX = Math.cos(this.driftOffset) * this.driftRadius * 0.01;
      const driftY = Math.sin(this.driftOffset * 0.7) * this.driftRadius * 0.01;

      this.x += this.vx + driftX;
      this.y += this.vy + driftY;

      // Mouse attraction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius && dist > 5) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * CONFIG.mouseForce * 0.05;
          this.vy += Math.sin(angle) * force * CONFIG.mouseForce * 0.05;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Gentle base movement
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;

      // Alpha breathing
      this.alpha += this.alphaSpeed * this.alphaDir;
      if (this.alpha > 0.7 || this.alpha < 0.05) {
        this.alphaDir *= -1;
      }

      // Wrap around edges
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      const color = CONFIG.colors[this.colorIndex];
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color + this.alpha + ')';
      ctx.fill();

      // Glow for larger particles
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = color + (this.alpha * 0.1) + ')';
        ctx.fill();
      }
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  function init() {
    resize();
    particles = [];
    const count = window.innerWidth < 768 ? 200 : CONFIG.particleCount;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate(time) {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(time);
      particles[i].draw();
    }

    // Draw subtle connection lines between nearby particles
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i += 3) {
      for (let j = i + 1; j < particles.length; j += 5) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  document.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Visibility API to pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Initialize
  init();
  animate(0);
})();
