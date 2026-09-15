/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — carousel.js
   Carrossel genérico arrastável (mouse/touch), sem dependências.
   Usado em "Antes e Depois" e nos depoimentos em texto.
   ============================================================ */

(function () {
  'use strict';

  function initCarousel(root) {
    const track = root.querySelector('[data-carousel-track]');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    if (!track) return;

    // ---------- Drag to scroll (mouse) ----------
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // deixa o touch nativo (scroll-snap) cuidar disso
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      if (moved) {
        // evita clique acidental em link/slide logo após arrastar
        const onClickCapture = (ev) => { ev.preventDefault(); ev.stopPropagation(); track.removeEventListener('click', onClickCapture, true); };
        track.addEventListener('click', onClickCapture, true);
        setTimeout(() => track.removeEventListener('click', onClickCapture, true), 0);
      }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointerleave', endDrag);

    // ---------- Setas ----------
    function slideStep() {
      const firstSlide = track.querySelector('.carousel__slide');
      if (!firstSlide) return track.clientWidth * 0.8;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap || style.columnGap || '24') || 24;
      return firstSlide.getBoundingClientRect().width + gap;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -slideStep(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: slideStep(), behavior: 'smooth' });
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
