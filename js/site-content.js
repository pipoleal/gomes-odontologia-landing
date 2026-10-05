/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — site-content.js
   Busca data/site-content.json (editável pelo painel admin.html) e:
   - mostra o pop-up de anúncio, se ativado (uma vez por visita —
     fechar guarda em sessionStorage, volta a aparecer numa nova sessão)
   - mostra um aviso de horário especial perto da seção "Como Chegar",
     se houver uma data cadastrada pra hoje ou pros próximos 7 dias
   ============================================================ */

(function () {
  'use strict';

  const DISMISS_KEY = 'gomes_announcement_dismissed';

  function renderAnnouncement(announcement) {
    if (!announcement || !announcement.enabled || !announcement.message) return;
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

    const overlay = document.createElement('div');
    overlay.className = 'announcement-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', announcement.title || 'Aviso');

    const linkHtml = announcement.linkUrl && announcement.linkLabel
      ? `<a href="${escapeAttr(announcement.linkUrl)}" class="btn btn--gold announcement-card__link" target="_blank" rel="noopener">${escapeHtml(announcement.linkLabel)}</a>`
      : '';

    const imageHtml = announcement.image
      ? `<img class="announcement-card__image" src="${escapeAttr('/' + announcement.image + (announcement.imageVersion ? '?v=' + announcement.imageVersion : ''))}" alt="">`
      : '';

    overlay.innerHTML = `
      <div class="announcement-card${announcement.image ? ' has-image' : ''}">
        <button type="button" class="announcement-card__close" aria-label="Fechar aviso">&times;</button>
        ${imageHtml}
        <div class="announcement-card__body">
          ${announcement.title ? `<h3>${escapeHtml(announcement.title)}</h3>` : ''}
          <p>${escapeHtml(announcement.message)}</p>
          ${linkHtml}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));

    function dismiss() {
      overlay.classList.remove('is-visible');
      sessionStorage.setItem(DISMISS_KEY, '1');
      setTimeout(() => overlay.remove(), 300);
    }

    overlay.querySelector('.announcement-card__close').addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', onEsc); }
    });
  }

  function renderSpecialHours(specialHours) {
    const container = document.getElementById('specialHoursNote');
    if (!container || !Array.isArray(specialHours) || !specialHours.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7days = new Date(today);
    in7days.setDate(in7days.getDate() + 7);

    const upcoming = specialHours
      .filter((h) => h.date)
      .map((h) => ({ ...h, dateObj: new Date(h.date + 'T00:00:00') }))
      .filter((h) => h.dateObj >= today && h.dateObj <= in7days)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (!upcoming.length) return;

    const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
    container.innerHTML = upcoming.map((h) => {
      const dateLabel = fmt.format(h.dateObj);
      const hoursLabel = h.closed ? 'fechado' : `${h.opens || '--'} às ${h.closes || '--'}`;
      const note = h.label ? ` (${escapeHtml(h.label)})` : '';
      return `<p class="special-hours-note__item"><strong>${dateLabel}</strong>${note}: ${hoursLabel}</p>`;
    }).join('');
    container.hidden = false;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  function init() {
    fetch('data/site-content.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        renderAnnouncement(data.announcement);
        renderSpecialHours(data.specialHours);
      })
      .catch(() => {}); // sem conteúdo dinâmico? site continua funcionando normal
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
