/* ============================================================
   CONNECT PAGE — Connect Card Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================================
  // CONNECT CARDS STAGGER REVEAL
  // ============================================================
  const connectCards = document.querySelectorAll('.connect-card');
  connectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    observer.observe(card);
  });

  // ============================================================
  // SECTION HEADER REVEAL
  // ============================================================
  if (typeof initReveals === 'function') {
    initReveals('.reveal-section');
  }

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
