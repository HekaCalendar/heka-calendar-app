/* ============================================================
   VENTURES PAGE — Constellation, Nodes, Cards
   GSAP required
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // VENTURE DATA
  // ============================================================
  const venturesData = [
    { name: 'Hekatae', initial: 'H', domain: 'Message Keepsaking', myth: 'Hu — the spoken word preserved', color: '#e8a838', x: 18, y: 22, url: 'https://hekatae.com', live: true },
    { name: 'Heka Calendar', initial: 'C', domain: 'Time & Cosmos', myth: "Ma'at — divine order", color: '#d4af37', x: 50, y: 8, url: 'https://hekacalendar.com', live: true },
    { name: 'Heka Time', initial: 'T', domain: 'Horology', myth: 'Sia — perceiving time', color: '#8ab4c7', x: 82, y: 22, url: 'https://hekatime.com', live: true },
    { name: 'Antidosis', initial: 'A', domain: 'Barter & Exchange', myth: 'Reciprocity — the flow of value', color: '#2d8a5e', x: 10, y: 50, url: 'https://antidosis.com', live: true },
    { name: 'Cinaema', initial: 'N', domain: 'Cinema & Streaming', myth: 'Sia — the vision made visible', color: '#c43e3e', x: 32, y: 38, url: 'https://cinaema.com', live: false },
    { name: 'Srevol', initial: 'R', domain: 'Travel for Lovers', myth: 'Love as creation', color: '#d4a0a0', x: 50, y: 52, url: 'https://srevol.com', live: true },
    { name: 'Stigmator', initial: 'S', domain: 'Wearable Art', myth: 'Ren — the mark of identity', color: '#c44444', x: 68, y: 38, url: 'https://stigmator.com', live: true },
    { name: 'Meek Meet', initial: 'M', domain: 'Community Circles', myth: 'Collective Heka — shared intention', color: '#a08060', x: 90, y: 50, url: 'https://meekmeet.com', live: true },
    { name: 'Oilamor', initial: 'O', domain: 'Essential Oils', myth: "Nefertem's breath — essence & healing", color: '#7a5a9a', x: 35, y: 82, url: 'https://oilamor.com', live: false },
    { name: 'Rehealia', initial: 'E', domain: 'Healing Herbs', myth: "Heka — medicine made manifest", color: '#5a9b5a', x: 72, y: 78, url: 'https://rehealia.com', live: false },
    { name: 'PUNYCODEX', initial: 'P', domain: 'Digital Protocols', myth: 'The language beneath language', color: '#00e5ff', x: 18, y: 72, url: '#', live: false },
    { name: 'GHOULVERSE', initial: 'G', domain: 'The Afterlife', myth: 'Where the dead still speak', color: '#ff2a6d', x: 85, y: 72, url: '#', live: false },
  ];

  // ============================================================
  // BUILD CONSTELLATION
  // ============================================================
  const constellationLines = document.getElementById('constellationLines');
  const ventureNodes = document.getElementById('ventureNodes');
  const venturesGrid = document.getElementById('venturesGrid');

  if (constellationLines && ventureNodes) {
    const connections = [
      [0, 1], [1, 2], [0, 3], [1, 5], [2, 7], [3, 4], [4, 5], [5, 6], [6, 7], [4, 8], [5, 8], [6, 9], [7, 9], [8, 9], [0, 5], [2, 5], [3, 5], [7, 5],
      [3, 10], [5, 10], [7, 11], [5, 11], [10, 11]
    ];

    connections.forEach(([a, b]) => {
      const va = venturesData[a];
      const vb = venturesData[b];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${va.x}%`);
      line.setAttribute('y1', `${va.y}%`);
      line.setAttribute('x2', `${vb.x}%`);
      line.setAttribute('y2', `${vb.y}%`);
      line.setAttribute('filter', 'url(#lineGlow)');
      line.style.opacity = '0';
      constellationLines.appendChild(line);

      gsap.to(line, {
        scrollTrigger: {
          trigger: '#ventures',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        duration: 1.5,
        delay: Math.random() * 0.8,
        ease: 'power2.out'
      });
    });

    // Build nodes
    venturesData.forEach((venture, index) => {
      const node = document.createElement('div');
      node.className = 'venture-node';
      node.style.left = `${venture.x}%`;
      node.style.top = `${venture.y}%`;
      node.innerHTML = `
        <div class="node-orb" style="background: ${venture.color}15; border: 1px solid ${venture.color}40; color: ${venture.color};">
          <span class="node-initial">${venture.initial}</span>
        </div>
        <span class="node-label-float">${venture.name}</span>
      `;
      ventureNodes.appendChild(node);

      gsap.from(node, {
        scrollTrigger: {
          trigger: '#ventures',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3 + index * 0.15,
        ease: 'back.out(1.7)'
      });
    });
  }

  // ============================================================
  // BUILD VENTURE CARDS
  // ============================================================
  if (venturesGrid) {
    venturesData.forEach((venture, index) => {
      const card = document.createElement('article');
      card.className = 'venture-card reveal-section';
      card.style.setProperty('--venture-color', venture.color);

      const linkHtml = venture.live
        ? `<a href="${venture.url}" class="venture-link" target="_blank" rel="noopener">
             Enter <svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </a>`
        : `<span class="venture-status"><span class="status-pulse"></span>In Formation</span>`;

      card.innerHTML = `
        <div class="venture-number">0${index + 1}</div>
        <h3 class="venture-name">${venture.name}</h3>
        <p class="venture-domain">${venture.domain}</p>
        <p class="venture-essence">${getVentureEssence(venture.name)}</p>
        <div class="venture-meta">
          <span class="venture-myth">${venture.myth}</span>
          ${linkHtml}
        </div>
      `;
      venturesGrid.appendChild(card);
    });

    // Animate cards
    const ventureCards = venturesGrid.querySelectorAll('.venture-card');
    ventureCards.forEach((card, index) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });
  }

  function getVentureEssence(name) {
    const essences = {
      'Hekatae': 'Preserve the words that matter, across any distance of time.',
      'Heka Calendar': 'Time itself, reimagined to honor the cycles that govern the sky.',
      'Heka Time': 'A wristwatch for a calendar that actually makes sense.',
      'Antidosis': 'Exchange value without losing soul.',
      'Cinaema': 'Every story is a spell. Every screen, a temple.',
      'Stigmator': 'Wear your identity. No needle required.',
      'Meek Meet': 'The meek shall inherit the earth — one circle at a time.',
      'Srevol': 'Travel the world with the one who makes it worth seeing.',
      'Oilamor': 'Pure essence in violet glass. Blend your own ritual.',
      'Rehealia': "Nature's pharmacy, prescribed by the earth itself.",
      'PUNYCODEX': 'Every character a spell. Every protocol, a doorway.',
      'GHOULVERSE': 'The veil is thin here. Walk carefully among the echoes.'
    };
    return essences[name] || '';
  }

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
