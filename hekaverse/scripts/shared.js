/* ============================================================
   HEKAVERSE — Shared JavaScript
   Optimized: throttled cursor, lighter particles, idle skip
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================================
  // CUSTOM CURSOR (throttled, idle-skip)
  // ============================================================
  const cursor = document.getElementById('customCursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;
    let mouseMoved = false;
    let cursorRaf;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mouseMoved = true;
    }, { passive: true });

    function updateCursor() {
      if (mouseMoved) {
        cursorX += (targetX - cursorX) * 0.92;
        cursorY += (targetY - cursorY) * 0.92;
        cursor.style.transform = `translate3d(${cursorX.toFixed(1)}px, ${cursorY.toFixed(1)}px, 0)`;
        if (Math.abs(targetX - cursorX) < 0.5 && Math.abs(targetY - cursorY) < 0.5) {
          mouseMoved = false;
        }
      }
      cursorRaf = requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover states — delegated to reduce listeners
    document.body.addEventListener('mouseenter', (e) => {
      const target = e.target.closest('a, button, .venture-node, .power-pillar, .connect-card, .venture-preview-item');
      if (target) cursor.classList.add('hovering');
    }, true);
    document.body.addEventListener('mouseleave', (e) => {
      const target = e.target.closest('a, button, .venture-node, .power-pillar, .connect-card, .venture-preview-item');
      if (target) cursor.classList.remove('hovering');
    }, true);
  }

  // ============================================================
  // MOBILE NAV
  // ============================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ============================================================
  // NAV SCROLL STATE (passive + rAF throttle)
  // ============================================================
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          mainNav.classList.toggle('scrolled', window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // REUSABLE REVEALS — IntersectionObserver
  // ============================================================
  window.initReveals = function initReveals(selector) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -15% 0px' });

    elements.forEach(el => observer.observe(el));
  };

  // ============================================================
  // PARTICLE SYSTEM (optimized)
  // 400 particles desktop / 120 mobile
  // Spatial-skip connections, squared distance, frame skip
  // ============================================================
  (function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let animationId;
    let isVisible = true;
    let frameCount = 0;

    const isMobile = window.innerWidth < 768;
    const dataCount = canvas.getAttribute('data-particle-count');
    const CONFIG = {
      particleCount: dataCount ? parseInt(dataCount, 10) : (isMobile ? 120 : 400),
      baseSpeed: 0.15,
      mouseRadius: 150,
      mouseForce: 0.8,
      colors: [
        'rgba(212, 175, 55, ',
        'rgba(201, 184, 232, ',
        'rgba(232, 106, 60, ',
        'rgba(240, 237, 232, ',
      ],
      minSize: 0.5,
      maxSize: 2.2,
      connDistSq: 100 * 100,
      connEvery: 2,
    };

    class Particle {
      constructor() { this.reset(); }
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
        this.driftOffset = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.0005 + Math.random() * 0.001;
        this.driftRadius = 20 + Math.random() * 80;
      }
      update() {
        this.driftOffset += this.driftSpeed;
        this.x += this.vx + Math.cos(this.driftOffset) * this.driftRadius * 0.01;
        this.y += this.vy + Math.sin(this.driftOffset * 0.7) * this.driftRadius * 0.01;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONFIG.mouseRadius * CONFIG.mouseRadius && distSq > 25) {
            const dist = Math.sqrt(distSq);
            const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * CONFIG.mouseForce * 0.05;
            this.vy += Math.sin(angle) * force * CONFIG.mouseForce * 0.05;
          }
        }

        this.vx *= 0.99;
        this.vy *= 0.99;
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;

        this.alpha += this.alphaSpeed * this.alphaDir;
        if (this.alpha > 0.7 || this.alpha < 0.05) this.alphaDir *= -1;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }
      draw() {
        const c = CONFIG.colors[this.colorIndex];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = c + this.alpha + ')';
        ctx.fill();
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = c + (this.alpha * 0.1) + ')';
          ctx.fill();
        }
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());
    }

    function animate() {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      frameCount++;
      ctx.fillStyle = '#020203';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Connections: only every Nth frame, skip-checked loops
      if (frameCount % CONFIG.connEvery === 0) {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.03)';
        ctx.lineWidth = 0.5;
        const len = particles.length;
        for (let i = 0; i < len; i += 3) {
          const pi = particles[i];
          for (let j = i + 1; j < len; j += 5) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            if (dx > 100 || dx < -100 || dy > 100 || dy < -100) continue;
            const distSq = dx * dx + dy * dy;
            if (distSq < CONFIG.connDistSq) {
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); init(); }, 150);
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => { mouse.active = false; });

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    init();
    animate();
  })();
});
