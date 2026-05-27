/* ============================================================
   HOME PAGE — Loading Ritual, Hero Animations, Manifesto
   GSAP required
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // LOADING RITUAL
  // ============================================================
  const loadingRitual = document.getElementById('loadingRitual');
  if (loadingRitual) {
    setTimeout(() => {
      loadingRitual.classList.add('ended');
      setTimeout(() => {
        initHeroAnimations();
      }, 500);
    }, 3500);
  } else {
    initHeroAnimations();
  }

  // ============================================================
  // HERO ANIMATIONS
  // ============================================================
  function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.reveal-hero');
    gsap.to(heroElements, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }

  // ============================================================
  // SECTION REVEALS (Venture Preview)
  // ============================================================
  const revealSections = document.querySelectorAll('.reveal-section');
  revealSections.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // ============================================================
  // MANIFESTO LINE REVEALS
  // ============================================================
  const manifestoLines = document.querySelectorAll('.reveal-manifesto');
  manifestoLines.forEach((line, index) => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: line,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: index * 0.4,
      ease: 'power3.out'
    });
  });

  // ============================================================
  // PARALLAX FOR HERO
  // ============================================================
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: 100,
    opacity: 0.3,
    ease: 'none'
  });

  // ============================================================
  // FOOTER REVEAL
  // ============================================================
  gsap.from('.main-footer', {
    scrollTrigger: {
      trigger: '.main-footer',
      start: 'top 95%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out'
  });
});
