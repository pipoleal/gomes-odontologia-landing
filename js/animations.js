/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — animations.js
   Movimento de câmera, parallax e reveals — GSAP + ScrollTrigger.
   Todo o módulo é ignorado se prefers-reduced-motion estiver ativo
   ou se o GSAP não carregar (degrada graciosamente para CSS estático).
   ============================================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  function revealStatic() {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  function init() {
    if (prefersReduced || !hasGSAP) {
      revealStatic();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Hero — reveal em cascata + parallax de imagem ---------- */
    const heroTl = gsap.timeline({ delay: 0.15 });
    heroTl.to('.hero [data-reveal]', {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
    });

    /* ---------- Reveal genérico para o restante da página ---------- */
    const revealGroups = new Set();
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.closest('.hero')) return; // já tratado acima
      const parent = el.parentElement;
      revealGroups.add(parent);
    });

    revealGroups.forEach((group) => {
      const items = group.querySelectorAll(':scope > [data-reveal]');
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          once: true,
        },
      });
    });

    /* ---------- Pilares — leve profundidade 3D ao passar o mouse ---------- */
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: y * -6,
          rotateY: x * 8,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });

    /* ---------- Editorial de especialidades — leve parallax por painel ---------- */
    document.querySelectorAll('.editorial__panel').forEach((panel) => {
      const media = panel.querySelector('.editorial__media .img-placeholder, .editorial__media .photo');
      if (!media) return;
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    /* ---------- About — leve escala de entrada na imagem ---------- */
    const aboutMedia = document.querySelector('.about__media .photo');
    if (aboutMedia) {
      gsap.fromTo(
        aboutMedia,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        }
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
