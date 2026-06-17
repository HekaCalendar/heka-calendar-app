/* ============================================================
   MYTHOLOGY PAGE — Typewriter, Powers, Section Reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================================
  // SECTION REVEALS
  // ============================================================
  if (typeof initReveals === 'function') {
    initReveals('.reveal-section');
  }

  // ============================================================
  // QUOTE TYPEWRITER EFFECT
  // ============================================================
  const quoteText = document.getElementById('quoteText');
  if (quoteText) {
    const fullText = quoteText.textContent;
    quoteText.textContent = '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let i = 0;
          const typeInterval = setInterval(() => {
            if (i < fullText.length) {
              quoteText.textContent += fullText.charAt(i);
              i++;
            } else {
              clearInterval(typeInterval);
            }
          }, 35);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(quoteText);
  }

  // ============================================================
  // POWER PILLAR INTERACTIONS
  // ============================================================
  const pillars = document.querySelectorAll('.power-pillar');
  pillars.forEach(pillar => {
    const symbol = pillar.querySelector('.pillar-symbol');
    if (!symbol) return;

    pillar.addEventListener('mouseenter', () => {
      symbol.style.transform = 'scale(1.1)';
    });
    pillar.addEventListener('mouseleave', () => {
      symbol.style.transform = 'scale(1)';
    });
  });

  // ============================================================
  // FOOTER REVEAL
  // ============================================================
  const footer = document.querySelector('.main-footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          footerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    footer.style.opacity = '0';
    footer.style.transform = 'translateY(30px)';
    footerObserver.observe(footer);
  }
});
