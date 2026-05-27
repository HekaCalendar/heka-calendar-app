/* ============================================================
   HEKAVERSE — Shared JavaScript
   Vanilla JS only. No GSAP dependencies.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursor = document.getElementById('customCursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function updateCursor() {
      cursorX += (targetX - cursorX) * 0.92;
      cursorY += (targetY - cursorY) * 0.92;
      cursor.style.transform = `translate3d(${cursorX.toFixed(1)}px, ${cursorY.toFixed(1)}px, 0)`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover states
    const hoverTargets = document.querySelectorAll('a, button, .venture-node, .power-pillar, .connect-card, .venture-preview-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
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

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ============================================================
  // NAV SCROLL STATE
  // ============================================================
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
          } else {
            mainNav.classList.remove('scrolled');
          }
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
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
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
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -15% 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // ============================================================
  // PARTICLE SYSTEM
  // ============================================================
  (function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let animationId;
    let isVisible = true;

    // Check for data-particle-count attribute
    const dataCount = canvas.getAttribute('data-particle-count');
    const defaultCount = window.innerWidth < 768 ? 300 : 800;
    const CONFIG = {
      particleCount: dataCount ? parseInt(dataCount, 10) : defaultCount,
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
        this.driftOffset += this.driftSpeed;
        const driftX = Math.cos(this.driftOffset) * this.driftRadius * 0.01;
        const driftY = Math.sin(this.driftOffset * 0.7) * this.driftRadius * 0.01;

        this.x += this.vx + driftX;
        this.y += this.vy + driftY;

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

        this.vx *= 0.99;
        this.vy *= 0.99;

        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;

        this.alpha += this.alphaSpeed * this.alphaDir;
        if (this.alpha > 0.7 || this.alpha < 0.05) {
          this.alphaDir *= -1;
        }

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
      const count = window.innerWidth < 768 ? Math.floor(CONFIG.particleCount * 0.375) : CONFIG.particleCount;
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

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    init();
    animate(0);
  })();
});
