/* ============================================
   SCAVASSINI TEAM GUIDED — JavaScript
   Animations, Scroll Effects, Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- SMOOTH SCROLL FOR ANCHORS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // ---- HERO FLOATING PARTICLES ----
  const particlesContainer = document.getElementById('hero-particles');
  const particleColors = [
    'rgba(30,136,229,0.6)',
    'rgba(0,191,165,0.5)',
    'rgba(255,255,255,0.3)',
    'rgba(66,165,245,0.4)',
  ];

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 6 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 6;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];

    particle.style.cssText = `
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, (duration + delay) * 1000);
  }

  // Create particles periodically
  for (let i = 0; i < 15; i++) {
    setTimeout(createParticle, i * 400);
  }

  setInterval(() => {
    if (document.visibilityState === 'visible') {
      createParticle();
    }
  }, 800);

  // ---- INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ----
  const revealElements = document.querySelectorAll(
    '.pain-card, .pillar-card, .step-card, .testimonial-card, .proof-num-item, .stat-item'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animations for grid items
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let index = 0;
        siblings.forEach((sib, sibIdx) => {
          if (sib === entry.target) index = sibIdx;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.proof-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent.trim();
        const isPercent = text.includes('%');
        const hasPlus = text.startsWith('+');
        const numMatch = text.match(/\d+/);
        if (!numMatch) return;

        const end = parseInt(numMatch[0]);
        const duration = 1600;
        const start = performance.now();

        function update(current) {
          const elapsed = current - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(eased * end);

          if (hasPlus) {
            target.textContent = `+${value}`;
          } else if (isPercent) {
            target.textContent = `${value}%`;
          } else {
            target.textContent = value === 0 ? '0' : `${value}`;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            target.textContent = text;
          }
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ---- HERO STATS ENTRANCE ----
  const heroStats = document.querySelectorAll('.stat-item');
  heroStats.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    setTimeout(() => {
      el.style.transition = '0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 800 + i * 150);
  });

  // ---- NAVBAR ACTIVE SECTION HIGHLIGHT ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.footer-col a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--blue-light)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ---- CTA BUTTON CLICK TRACKING (Analytics ready) ----
  const ctaButtons = document.querySelectorAll('[id$="-btn"]');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ready for analytics integration (Google Analytics, etc.)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: btn.id,
        });
      }
    });
  });

  // ---- SCAN LINE ANIMATION RESTART ----
  const scanLine = document.querySelector('.scan-line');
  if (scanLine) {
    setInterval(() => {
      scanLine.style.animation = 'none';
      void scanLine.offsetWidth; // Trigger reflow
      scanLine.style.animation = 'scan-move 3s ease-in-out infinite';
    }, 6000);
  }

  // ---- FLOATING WHATSAPP VISIBILITY ----
  const floatingBtn = document.querySelector('.floating-whatsapp');
  const heroSection = document.getElementById('hero');

  const floatingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        floatingBtn.style.opacity = '0';
        floatingBtn.style.pointerEvents = 'none';
      } else {
        floatingBtn.style.opacity = '1';
        floatingBtn.style.pointerEvents = 'auto';
      }
    });
  }, { threshold: 0.5 });

  floatingObserver.observe(heroSection);

  // ---- TYPING EFFECT FOR HERO BADGE ----
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const text = 'Planning Center Digital para Implantodontia';
    heroBadge.innerHTML = '<span class="badge-dot"></span><span class="badge-text"></span>';
    const badgeText = heroBadge.querySelector('.badge-text');
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        badgeText.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 40);
      }
    }

    setTimeout(typeChar, 400);
  }

  // ---- CARD TILT EFFECT (apenas em dispositivos com mouse) ----
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouchDevice) {
    const cards = document.querySelectorAll('.pillar-card, .visual-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  console.log('%c🦷 Scavassini Team Guided — Planning Center Digital', 'font-size:14px; font-weight:bold; color:#1E88E5;');
  console.log('%cLanding Page carregada com sucesso!', 'font-size:11px; color:#00BFA5;');
});
