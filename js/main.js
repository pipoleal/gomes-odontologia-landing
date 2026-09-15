/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — main.js
   Configuração geral, navegação, WhatsApp, menu mobile.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIGURAÇÃO — EDITAR AQUI
     ---------------------------------------------------------- */
  const CONFIG = {
    // Número confirmado diretamente no link oficial da bio do Instagram
    // @gomesodontoestetica (wa.me/5512996119641), logado no perfil real da
    // clínica — não é mais uma suposição. Ainda assim, vale uma confirmação
    // rápida com a cliente antes de publicar em produção.
    whatsappNumber: '5512996119641',
    whatsappMessage: 'Olá! Gostaria de agendar uma avaliação na Gomes Odontologia & Estética.',
  };

  document.documentElement.classList.remove('no-js');

  /* ----------------------------------------------------------
     WhatsApp — injeta o link em todos os CTAs marcados
     ---------------------------------------------------------- */
  function wireWhatsAppLinks() {
    const hasNumber = CONFIG.whatsappNumber && CONFIG.whatsappNumber !== 'WHATSAPP_NUMBER_HERE';
    const href = hasNumber
      ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`
      : '#como-chegar'; // fallback enquanto o número não é confirmado

    document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
      el.setAttribute('href', href);
      if (hasNumber) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        el.removeAttribute('target');
        el.title = 'Número de WhatsApp pendente de confirmação — redirecionando para localização.';
      }
    });
  }

  /* ----------------------------------------------------------
     Header — estado "scrolled"
     ---------------------------------------------------------- */
  function wireHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     Menu mobile
     ---------------------------------------------------------- */
  function wireMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      setOpen(!menu.classList.contains('is-open'));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
  }

  /* ----------------------------------------------------------
     Ano atual no rodapé
     ---------------------------------------------------------- */
  function setCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Prefers-reduced-motion — marca no <html> para o CSS/animations.js
     ---------------------------------------------------------- */
  function wireReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => document.documentElement.classList.toggle('reduced-motion', mq.matches);
    apply();
    mq.addEventListener('change', apply);
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireWhatsAppLinks();
    wireHeaderScroll();
    wireMobileMenu();
    setCurrentYear();
    wireReducedMotion();
  });
})();
