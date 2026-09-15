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

    /* ---------- Tratamentos (lista compacta) — leve parallax por linha ---------- */
    document.querySelectorAll('.treatment-row').forEach((row) => {
      const media = row.querySelector('.treatment-row__media');
      if (!media) return;
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: row,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    /* ---------- Bio da Dra. Alanis — leve escala de entrada na imagem ---------- */
    const doctorBioMedia = document.querySelector('.doctor-bio__media .photo');
    if (doctorBioMedia) {
      gsap.fromTo(
        doctorBioMedia,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.doctor-bio',
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
