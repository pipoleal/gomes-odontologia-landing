/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — site-content.js
   Busca data/site-content.json (editável pelo painel admin.html) e:
   - mostra o modal de anúncio de maior prioridade que estiver ativo
     e dentro do período configurado, depois de um atraso configurável,
     respeitando um cooldown de N dias por anúncio (localStorage)
   - mostra um aviso de horário especial perto da seção "Como Chegar",
     se houver uma data cadastrada pra hoje ou pros próximos 7 dias
   Depende de js/announcement-modal.js (carregado antes deste arquivo).
   ============================================================ */

(function () {
  'use strict';

  var Modal = window.GomesAnnouncementModal;

  function dismissedKey(id) {
    return 'gomes_ann_dismissed_' + id;
  }

  function readDismissedAt(id) {
    try {
      var raw = localStorage.getItem(dismissedKey(id));
      return raw ? parseInt(raw, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  function writeDismissedNow(id) {
    try {
      localStorage.setItem(dismissedKey(id), String(Date.now()));
    } catch (e) {
      // localStorage indisponível (modo privado etc.) — sem cooldown persistido,
      // mas o site continua funcionando normalmente.
    }
  }

  function isInCooldown(ann) {
    var cooldownDays = typeof ann.cooldownDays === 'number' ? ann.cooldownDays : 3;
    if (cooldownDays <= 0) return false;
    var dismissedAt = readDismissedAt(ann.id);
    if (!dismissedAt) return false;
    var elapsedMs = Date.now() - dismissedAt;
    return elapsedMs < cooldownDays * 24 * 60 * 60 * 1000;
  }

  function showAnnouncement(ann) {
    if (ann.image) {
      // Começa a carregar a imagem já durante o atraso de abertura, pra ela
      // estar no cache do navegador (ou já carregada) quando o modal aparecer.
      try {
        var preload = new Image();
        preload.src = Modal.imageSrc(ann);
      } catch (e) {
        // ignora — na pior das hipóteses a imagem carrega junto com o modal
      }
    }

    var overlay = document.createElement('div');
    overlay.className = 'announcement-overlay';
    overlay.innerHTML = Modal.buildCardMarkup(ann);
    document.body.appendChild(overlay);

    var card = overlay.querySelector('.announcement-card');
    var previouslyFocused = document.activeElement;

    function getFocusable() {
      return Array.prototype.slice.call(
        card.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function close() {
      writeDismissedNow(ann.id);
      overlay.classList.remove('is-visible');
      document.removeEventListener('keydown', onKeydown, true);
      setTimeout(function () {
        overlay.remove();
      }, 350);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    card.querySelectorAll('[data-action="close"]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', onKeydown, true);

    requestAnimationFrame(function () {
      overlay.classList.add('is-visible');
      card.focus();
    });
  }

  function initAnnouncement(data) {
    var announcements = Modal.normalizeAnnouncements(data);
    var winner = Modal.pickActive(announcements, new Date());
    if (!winner || isInCooldown(winner)) return;

    var delaySeconds = typeof winner.delaySeconds === 'number' ? winner.delaySeconds : 3;
    setTimeout(function () {
      showAnnouncement(winner);
    }, Math.max(0, delaySeconds) * 1000);
  }

  function renderSpecialHours(specialHours) {
    var container = document.getElementById('specialHoursNote');
    if (!container || !Array.isArray(specialHours) || !specialHours.length) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var in7days = new Date(today);
    in7days.setDate(in7days.getDate() + 7);

    var upcoming = specialHours
      .filter(function (h) { return h.date; })
      .map(function (h) {
        return Object.assign({}, h, { dateObj: new Date(h.date + 'T00:00:00') });
      })
      .filter(function (h) { return h.dateObj >= today && h.dateObj <= in7days; })
      .sort(function (a, b) { return a.dateObj - b.dateObj; });

    if (!upcoming.length) return;

    var fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
    container.innerHTML = upcoming.map(function (h) {
      var dateLabel = fmt.format(h.dateObj);
      var hoursLabel = h.closed ? 'fechado' : (h.opens || '--') + ' às ' + (h.closes || '--');
      var note = h.label ? ' (' + Modal.escapeHtml(h.label) + ')' : '';
      return '<p class="special-hours-note__item"><strong>' + dateLabel + '</strong>' + note + ': ' + hoursLabel + '</p>';
    }).join('');
    container.hidden = false;
  }

  function init() {
    if (!Modal) return; // js/announcement-modal.js não carregou — não derruba o resto do site
    fetch('data/site-content.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        initAnnouncement(data);
        renderSpecialHours(data.specialHours);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
